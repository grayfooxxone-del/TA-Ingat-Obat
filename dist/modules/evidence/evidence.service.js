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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const evidence_entity_1 = require("./entities/evidence.entity");
const pmo_patient_entity_1 = require("../pmo/entities/pmo-patient.entity");
const schedule_entity_1 = require("../schedules/entities/schedule.entity");
const users_service_1 = require("../users/users.service");
const firebase_service_1 = require("../firebase/firebase.service");
let EvidenceService = class EvidenceService {
    constructor(evidenceRepository, pmoPatientRepository, scheduleRepository, usersService, firebaseService) {
        this.evidenceRepository = evidenceRepository;
        this.pmoPatientRepository = pmoPatientRepository;
        this.scheduleRepository = scheduleRepository;
        this.usersService = usersService;
        this.firebaseService = firebaseService;
    }
    async uploadEvidence(createEvidenceDto) {
        const evidence = this.evidenceRepository.create({
            userId: parseInt(createEvidenceDto.userId),
            scheduleId: createEvidenceDto.scheduleId
                ? parseInt(createEvidenceDto.scheduleId)
                : null,
            type: createEvidenceDto.type,
            fileUrl: createEvidenceDto.fileUrl,
            photoUrl: createEvidenceDto.fileUrl,
            note: createEvidenceDto.note,
            verified: false,
            status: 'pending',
        });
        const saved = await this.evidenceRepository.save(evidence);
        try {
            const patient = await this.usersService.getUserById(createEvidenceDto.userId);
            if (patient) {
                let isLate = false;
                let diffMins = 0;
                let timeString = '';
                if (createEvidenceDto.scheduleId) {
                    const schedule = await this.scheduleRepository.findOne({
                        where: { id: parseInt(createEvidenceDto.scheduleId) },
                    });
                    if (schedule) {
                        timeString = schedule.time;
                        const [h, m] = timeString.split(':').map(Number);
                        const now = new Date();
                        const schedDate = new Date(schedule.createdAt);
                        const wibOffsetMs = 7 * 60 * 60 * 1000;
                        schedDate.setUTCHours(0, 0, 0, 0);
                        schedDate.setTime(schedDate.getTime() + h * 3600000 + m * 60000 - wibOffsetMs);
                        diffMins = Math.round((now.getTime() - schedDate.getTime()) / 60000);
                        if (diffMins > 30) {
                            isLate = true;
                        }
                    }
                }
                const pairings = await this.pmoPatientRepository.find({
                    where: { patientId: patient.id, status: 'active' },
                    relations: ['pmo'],
                });
                for (const pair of pairings) {
                    if (pair.pmo && pair.pmo.deviceToken) {
                        const title = isLate ? 'Pasien Terlambat Minum Obat! ⚠️' : 'Perlu Verifikasi Bukti! 📷';
                        const body = isLate
                            ? `Pasien ${patient.name} mengunggah bukti secara TERLAMBAT (lewat ${diffMins} menit) untuk jadwal jam ${timeString}.`
                            : `Pasien ${patient.name} baru saja mengunggah bukti minum obat untuk jadwal jam ${timeString || 'yang ditentukan'}.`;
                        await this.firebaseService.sendPushNotification(pair.pmo.deviceToken, title, body, {
                            type: 'need_verification',
                            evidenceId: saved.id.toString(),
                            patientId: patient.id.toString(),
                        });
                    }
                }
            }
        }
        catch (err) {
            console.error('Gagal mengirim notifikasi bukti ke PMO:', err);
        }
        return this.toDto(saved);
    }
    async getEvidenceByUser(userId) {
        const evidences = await this.evidenceRepository.find({
            where: { userId: parseInt(userId) },
            order: { createdAt: 'DESC' },
        });
        return evidences.map((e) => this.toDto(e));
    }
    async getEvidenceById(evidenceId) {
        const evidence = await this.evidenceRepository.findOne({
            where: { id: parseInt(evidenceId) },
        });
        if (!evidence)
            throw new common_1.NotFoundException('Bukti tidak ditemukan');
        return this.toDto(evidence);
    }
    async verifyEvidence(evidenceId, updateEvidenceDto) {
        const evidence = await this.evidenceRepository.findOne({
            where: { id: parseInt(evidenceId) },
        });
        if (!evidence)
            throw new common_1.NotFoundException('Bukti tidak ditemukan');
        evidence.verified = updateEvidenceDto.verified ?? evidence.verified;
        evidence.verifiedBy = updateEvidenceDto.verifiedBy ?? evidence.verifiedBy;
        evidence.status = updateEvidenceDto.verified ? 'verified' : 'rejected';
        if (updateEvidenceDto.verified)
            evidence.verifiedAt = new Date();
        const updated = await this.evidenceRepository.save(evidence);
        try {
            const patient = await this.usersService.getUserById(updated.userId.toString());
            if (patient && patient.deviceToken) {
                const title = updated.status === 'verified'
                    ? 'Bukti Kepatuhan Disetujui! 🎉'
                    : 'Bukti Kepatuhan Ditolak ⚠️';
                const body = updated.status === 'verified'
                    ? 'Selamat! Foto konsumsi obat Anda telah diverifikasi oleh PMO.'
                    : 'Pesan PMO: Harap unggah ulang foto konsumsi obat yang benar.';
                await this.firebaseService.sendPushNotification(patient.deviceToken, title, body, {
                    type: 'evidence_verification',
                    status: updated.status,
                    evidenceId: updated.id.toString(),
                    sentAt: Date.now().toString(),
                });
            }
        }
        catch (error) {
            console.error('Failed to send push notification on evidence verification:', error);
        }
        return this.toDto(updated);
    }
    async getPendingEvidenceForPatients(patientIds) {
        if (patientIds.length === 0)
            return [];
        const evidences = await this.evidenceRepository
            .createQueryBuilder('e')
            .where('e.userId IN (:...patientIds)', { patientIds })
            .orderBy('e.createdAt', 'DESC')
            .getMany();
        return evidences.map((e) => this.toDto(e));
    }
    async getPendingEvidenceForPMO() {
        const evidences = await this.evidenceRepository.find({
            where: { verified: false },
            order: { createdAt: 'DESC' },
        });
        return evidences.map((e) => this.toDto(e));
    }
    toDto(evidence) {
        return {
            id: evidence.id.toString(),
            userId: evidence.userId.toString(),
            scheduleId: evidence.scheduleId?.toString() || '',
            type: evidence.type,
            fileUrl: evidence.fileUrl || evidence.photoUrl || undefined,
            filePath: evidence.fileUrl || evidence.photoUrl || undefined,
            uploadedAt: evidence.createdAt,
            verified: evidence.verified,
            verifiedAt: evidence.verifiedAt || undefined,
            verifiedBy: evidence.verifiedBy || undefined,
            status: evidence.status,
            note: evidence.note || undefined,
        };
    }
};
exports.EvidenceService = EvidenceService;
exports.EvidenceService = EvidenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(evidence_entity_1.Evidence)),
    __param(1, (0, typeorm_1.InjectRepository)(pmo_patient_entity_1.PmoPatient)),
    __param(2, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        firebase_service_1.FirebaseService])
], EvidenceService);
//# sourceMappingURL=evidence.service.js.map