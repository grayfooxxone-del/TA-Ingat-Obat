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
var TestLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const test_log_entity_1 = require("./test-log.entity");
let TestLogService = TestLogService_1 = class TestLogService {
    toWIB(date) {
        const wibOffset = 7 * 60 * 60 * 1000;
        const wibDate = new Date(date.getTime() + wibOffset);
        const iso = wibDate.toISOString().replace('T', ' ').replace('Z', '');
        return `${iso} WIB`;
    }
    translateTestType(raw) {
        const map = {
            FCM_REMINDER: 'Ingatkan Pasien',
            FCM_VERIFICATION: 'Verifikasi Bukti',
            IOT_OPEN: 'Status Kotak (Tutup → Buka)',
            IOT_CLOSE: 'Status Kotak (Buka → Tutup)',
        };
        return map[raw] ?? raw;
    }
    constructor(testLogRepository) {
        this.testLogRepository = testLogRepository;
        this.logger = new common_1.Logger(TestLogService_1.name);
    }
    async createLog(createTestLogDto) {
        const sentAtRaw = createTestLogDto.sentAt;
        let sentAtMs;
        if (/^\d+$/.test(sentAtRaw.trim())) {
            sentAtMs = parseInt(sentAtRaw);
        }
        else {
            sentAtMs = new Date(sentAtRaw).getTime();
        }
        const now = new Date();
        const receivedAtMs = now.getTime();
        const delayMs = Math.max(0, receivedAtMs - sentAtMs);
        const sentAtWib = this.toWIB(new Date(sentAtMs));
        const receivedAtWib = this.toWIB(now);
        const namaUji = this.translateTestType(createTestLogDto.testType);
        const newLog = this.testLogRepository.create({
            testType: namaUji,
            sentAt: sentAtWib,
            receivedAt: receivedAtWib,
            delayMs: delayMs,
        });
        const savedLog = await this.testLogRepository.save(newLog);
        this.logger.log(`[UJI SKRIPSI] Jenis Uji  : ${namaUji}`);
        this.logger.log(`> Waktu Kirim  : ${sentAtWib}`);
        this.logger.log(`> Waktu Terima : ${receivedAtWib}`);
        this.logger.log(`> TOTAL DELAY  : ${delayMs} milidetik`);
        return savedLog;
    }
};
exports.TestLogService = TestLogService;
exports.TestLogService = TestLogService = TestLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(test_log_entity_1.TestLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TestLogService);
//# sourceMappingURL=test-log.service.js.map