"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const iot_device_log_entity_1 = require("./entities/iot-device-log.entity");
let IotService = IotService_1 = class IotService {
    constructor(userRepository, iotDeviceLogRepository) {
        this.userRepository = userRepository;
        this.iotDeviceLogRepository = iotDeviceLogRepository;
        this.logger = new common_1.Logger(IotService_1.name);
        this.MQTT_URL = 'mqtts://afd876b9ba3744f7ab10cded6fc3c7b5.s1.eu.hivemq.cloud:8883';
        this.MQTT_USERNAME = 'Saif12.';
        this.MQTT_PASSWORD = 'Saif04knazz';
    }
    onModuleInit() {
        this.connectToBroker();
        this.offlineCheckInterval = setInterval(() => {
            this.checkOfflineDevices().catch((err) => {
                this.logger.error('Error saat mengecek alat offline:', err);
            });
        }, 5 * 1000);
    }
    onModuleDestroy() {
        if (this.client) {
            this.client.end();
        }
        if (this.offlineCheckInterval) {
            clearInterval(this.offlineCheckInterval);
        }
    }
    connectToBroker() {
        this.logger.log('Mencoba terhubung ke HiveMQ...');
        this.client = mqtt.connect(this.MQTT_URL, {
            username: this.MQTT_USERNAME,
            password: this.MQTT_PASSWORD,
            clientId: `nestjs-backend-${Math.random().toString(16).slice(2, 8)}`,
            protocolVersion: 5,
        });
        this.client.on('connect', () => {
            this.logger.log('Berhasil terhubung ke HiveMQ!');
            this.client.subscribe('tb-app/+/box-status', (err) => {
                if (!err) {
                    this.logger.log('Berhasil subscribe ke topik tb-app/+/box-status');
                }
                else {
                    this.logger.error('Gagal subscribe:', err);
                }
            });
        });
        this.client.on('message', (topic, message) => {
            this.logger.log(`Pesan diterima di topik ${topic}: ${message.toString()}`);
            this.handleIncomingMessage(topic, message.toString()).catch((err) => {
                this.logger.error('Failed to handle incoming MQTT message:', err);
            });
        });
        this.client.on('error', (err) => {
            this.logger.error('MQTT Error:', err);
        });
    }
    async handleIncomingMessage(topic, message) {
        try {
            const parts = topic.split('/');
            if (parts.length < 3)
                return;
            const patientCode = parts[1];
            const data = JSON.parse(message);
            const user = await this.userRepository.findOne({
                where: { patientCode },
            });
            if (user) {
                user.iotStatus = 'Hidup';
                user.boxStatus = data.status_kotak;
                user.batteryLevel = Math.round(data.persentase_baterai ?? 0);
                user.lastIotUpdateAt = new Date();
                if (data.status_kotak === 'TERBUKA') {
                    user.lastOpenedAt = new Date();
                }
                await this.userRepository.save(user);
                this.logger.log(`Data IoT untuk pasien ${patientCode} berhasil diperbarui di database.`);
                let eventType = 'PING';
                if (data.status_kotak === 'TERBUKA') {
                    eventType = 'BOX_OPENED';
                }
                else if (data.status_kotak === 'TERTUTUP') {
                    eventType = 'BOX_CLOSED';
                }
                const batteryVal = Math.round(data.persentase_baterai ?? 0);
                if (batteryVal > 0 && batteryVal <= 20) {
                    eventType = 'LOW_BATTERY';
                }
                const deviceLog = this.iotDeviceLogRepository.create({
                    patientCode,
                    eventType,
                    batteryLevel: batteryVal,
                    rawPayload: data,
                });
                await this.iotDeviceLogRepository.save(deviceLog);
                this.logger.log(`Log IoT event ${eventType} untuk pasien ${patientCode} berhasil disimpan ke database.`);
            }
            else {
                this.logger.warn(`Pasien dengan kode ${patientCode} tidak ditemukan di database.`);
            }
        }
        catch (error) {
            this.logger.error('Gagal memproses pesan MQTT:', error);
        }
    }
    async checkOfflineDevices() {
        const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
        const offlineUsers = await this.userRepository
            .createQueryBuilder('user')
            .where('user.lastIotUpdateAt < :time', { time: fifteenSecondsAgo })
            .andWhere("user.iotStatus = 'Hidup'")
            .getMany();
        if (offlineUsers.length > 0) {
            for (const u of offlineUsers) {
                u.iotStatus = 'Mati';
                await this.userRepository.save(u);
                const deviceLog = this.iotDeviceLogRepository.create({
                    patientCode: u.patientCode,
                    eventType: 'OFFLINE',
                    batteryLevel: u.batteryLevel,
                    rawPayload: {
                        reason: 'Tidak ada aktivitas pings selama lebih dari 1 menit',
                    },
                });
                await this.iotDeviceLogRepository.save(deviceLog);
            }
            this.logger.log(`${offlineUsers.length} perangkat IoT ditandai OFFLINE dan dicatat ke log.`);
        }
    }
};
exports.IotService = IotService;
exports.IotService = IotService = IotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(iot_device_log_entity_1.IotDeviceLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], IotService);
//# sourceMappingURL=iot.service.js.map