import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IotDeviceLog } from './entities/iot-device-log.entity';

@Injectable()
export class IotService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(IotService.name);

  // Ganti dengan kredensial HiveMQ Anda yang sama dengan di Arduino
  private readonly MQTT_URL =
    'mqtts://afd876b9ba3744f7ab10cded6fc3c7b5.s1.eu.hivemq.cloud:8883';
  private readonly MQTT_USERNAME = 'Saif12.';
  private readonly MQTT_PASSWORD = 'Saif04knazz';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(IotDeviceLog)
    private readonly iotDeviceLogRepository: Repository<IotDeviceLog>,
  ) {}

  private offlineCheckInterval: NodeJS.Timeout;

  onModuleInit() {
    this.connectToBroker();

    // Cek alat yang mati setiap 5 detik
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

  private connectToBroker() {
    this.logger.log('Mencoba terhubung ke HiveMQ...');

    this.client = mqtt.connect(this.MQTT_URL, {
      username: this.MQTT_USERNAME,
      password: this.MQTT_PASSWORD,
      clientId: `nestjs-backend-${Math.random().toString(16).slice(2, 8)}`,
      protocolVersion: 5,
    });

    this.client.on('connect', () => {
      this.logger.log('Berhasil terhubung ke HiveMQ!');
      // Subscribe ke topik semua pasien. '+' adalah wildcard untuk ID Pasien
      this.client.subscribe('tb-app/+/box-status', (err) => {
        if (!err) {
          this.logger.log('Berhasil subscribe ke topik tb-app/+/box-status');
        } else {
          this.logger.error('Gagal subscribe:', err);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      this.logger.log(
        `Pesan diterima di topik ${topic}: ${message.toString()}`,
      );
      this.handleIncomingMessage(topic, message.toString()).catch((err) => {
        this.logger.error('Failed to handle incoming MQTT message:', err);
      });
    });

    this.client.on('error', (err) => {
      this.logger.error('MQTT Error:', err);
    });
  }

  private async handleIncomingMessage(topic: string, message: string) {
    try {
      // Ekstrak patientCode dari topik tb-app/PAT-1234/box-status
      const parts = topic.split('/');
      if (parts.length < 3) return;
      const patientCode = parts[1]; // misal "patient-001" atau "PAT-1234"

      const data = JSON.parse(message) as {
        status_kotak?: string;
        persentase_baterai?: number;
      };

      // Update data di database
      const user = await this.userRepository.findOne({
        where: { patientCode },
      });

      if (user) {
        user.iotStatus = 'Hidup';
        user.boxStatus = data.status_kotak; // "TERBUKA" atau "TERTUTUP"
        user.batteryLevel = Math.round(data.persentase_baterai ?? 0);
        user.lastIotUpdateAt = new Date();

        if (data.status_kotak === 'TERBUKA') {
          user.lastOpenedAt = new Date();
        }

        await this.userRepository.save(user);
        this.logger.log(
          `Data IoT untuk pasien ${patientCode} berhasil diperbarui di database.`,
        );

        // Simpan log riwayat aktivitas IoT
        let eventType = 'PING';
        if (data.status_kotak === 'TERBUKA') {
          eventType = 'BOX_OPENED';
        } else if (data.status_kotak === 'TERTUTUP') {
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
        this.logger.log(
          `Log IoT event ${eventType} untuk pasien ${patientCode} berhasil disimpan ke database.`,
        );
      } else {
        this.logger.warn(
          `Pasien dengan kode ${patientCode} tidak ditemukan di database.`,
        );
      }
    } catch (error) {
      this.logger.error('Gagal memproses pesan MQTT:', error);
    }
  }

  // Dipanggil secara berkala via Cron Job atau manual untuk mengecek alat yang mati
  async checkOfflineDevices() {
    // Jika tidak ada update lebih dari 15 detik, anggap alat "Mati"
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);

    // Cari perangkat yang statusnya masih 'Hidup' tetapi tidak mengirim ping > 15 detik
    const offlineUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.lastIotUpdateAt < :time', { time: fifteenSecondsAgo })
      .andWhere("user.iotStatus = 'Hidup'")
      .getMany();

    if (offlineUsers.length > 0) {
      for (const u of offlineUsers) {
        u.iotStatus = 'Mati';
        await this.userRepository.save(u);

        // Simpan log event OFFLINE
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
      this.logger.log(
        `${offlineUsers.length} perangkat IoT ditandai OFFLINE dan dicatat ke log.`,
      );
    }
  }
}
