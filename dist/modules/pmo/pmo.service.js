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
exports.PMOService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pmo_patient_entity_1 = require("./entities/pmo-patient.entity");
const users_service_1 = require("../users/users.service");
const evidence_service_1 = require("../evidence/evidence.service");
const gamification_service_1 = require("../gamification/gamification.service");
const schedules_service_1 = require("../schedules/schedules.service");
const firebase_service_1 = require("../firebase/firebase.service");
let PMOService = class PMOService {
    constructor(pmoPatientRepository, usersService, evidenceService, gamificationService, scheduleService, firebaseService) {
        this.pmoPatientRepository = pmoPatientRepository;
        this.usersService = usersService;
        this.evidenceService = evidenceService;
        this.gamificationService = gamificationService;
        this.scheduleService = scheduleService;
        this.firebaseService = firebaseService;
        this.notifiedMissedSchedules = new Set();
    }
    onModuleInit() {
        this.missedCheckInterval = setInterval(() => {
            this.checkMissedSchedules().catch((err) => {
                console.error('Error saat mengecek jadwal terlewat:', err);
            });
        }, 60 * 1000);
    }
    onModuleDestroy() {
        if (this.missedCheckInterval) {
            clearInterval(this.missedCheckInterval);
        }
    }
    async checkMissedSchedules() {
        try {
            const pairings = await this.pmoPatientRepository.find({
                where: { status: 'active' },
                relations: ['pmo', 'patient'],
            });
            for (const pair of pairings) {
                if (!pair.pmo || !pair.pmo.deviceToken || !pair.patient)
                    continue;
                const yesterdayOrOlderInstances = [];
                for (const sched of yesterdayOrOlderInstances) {
                    const key = `${sched.id}-terlewat`;
                    if (this.notifiedMissedSchedules.has(key))
                        continue;
                    this.notifiedMissedSchedules.add(key);
                    const dateString = sched.scheduledDate
                        ? new Date(sched.scheduledDate).toLocaleDateString('id-ID')
                        : 'Kemarin';
                    await this.firebaseService.sendPushNotification(pair.pmo.deviceToken, 'Pasien Terlewat Minum Obat! 🚨', `Pasien ${pair.patient.name} TERLEWAT minum obat untuk jadwal tanggal ${dateString} jam ${sched.time} (Sudah lewat lebih dari 1 hari).`, {
                        type: 'missed_intake',
                        patientId: pair.patientId.toString(),
                        scheduleId: sched.id.toString(),
                    });
                    console.log(`[PMO Service] Notifikasi terlewat (> 1 hari) dikirim ke PMO ${pair.pmo.name} untuk pasien ${pair.patient.name}`);
                }
            }
        }
        catch (error) {
            console.error('[PMO Service] Gagal mengecek jadwal terlewat:', error);
        }
    }
    async pairPatient(pmoId, pairPatientDto) {
        const patient = await this.usersService.findByPatientCode(pairPatientDto.patientCode);
        if (!patient) {
            throw new common_1.NotFoundException(`Pasien dengan kode "${pairPatientDto.patientCode}" tidak ditemukan.`);
        }
        const existingPairing = await this.pmoPatientRepository.findOne({
            where: {
                pmoId: parseInt(pmoId),
                patientId: patient.id,
                status: 'active',
            },
        });
        if (existingPairing) {
            return {
                message: 'Pasien sudah terhubung sebelumnya',
                data: {
                    ...existingPairing,
                    patientName: patient.name,
                    patientCode: patient.patientCode,
                },
            };
        }
        const pairing = this.pmoPatientRepository.create({
            pmoId: parseInt(pmoId),
            patientId: patient.id,
            status: 'active',
        });
        const saved = await this.pmoPatientRepository.save(pairing);
        return {
            message: `Pasien ${patient.name} berhasil terhubung`,
            data: {
                ...saved,
                patientName: patient.name,
                patientCode: patient.patientCode,
            },
        };
    }
    async getMonitoredPatients(pmoId) {
        const pairings = await this.pmoPatientRepository.find({
            where: { pmoId: parseInt(pmoId), status: 'active' },
            relations: ['patient'],
        });
        return pairings.map((p) => ({
            id: p.patientId.toString(),
            name: p.patient.name,
            pairedDate: p.pairedAt,
            status: p.status,
            lastUpdate: new Date(),
            compliance: Math.floor(Math.random() * 100),
            phone: p.patient.phone,
            address: p.patient.address,
        }));
    }
    async getConnectedPMOs(patientId) {
        const pairings = await this.pmoPatientRepository.find({
            where: { patientId: parseInt(patientId), status: 'active' },
            relations: ['pmo'],
        });
        return pairings.map((p) => ({
            id: p.pmoId.toString(),
            name: p.pmo.name,
            hospital: p.pmo.address || 'Puskesmas Harapan',
            connectedDate: p.pairedAt ? p.pairedAt.toISOString().split('T')[0] : '',
            status: p.status === 'active' ? 'Aktif' : 'Non-aktif',
            phone: p.pmo.phone,
            address: p.pmo.address,
        }));
    }
    async getPendingEvidence(pmoId) {
        const pairings = await this.pmoPatientRepository.find({
            where: { pmoId: parseInt(pmoId), status: 'active' },
        });
        const patientIds = pairings.map((p) => p.patientId);
        return await this.evidenceService.getPendingEvidenceForPatients(patientIds);
    }
    async getDashboardData(pmoId) {
        const pairings = await this.pmoPatientRepository.find({
            where: { pmoId: parseInt(pmoId), status: 'active' },
            relations: ['patient'],
        });
        const totalPasien = pairings.length;
        let totalPerluVerifikasi = 0;
        let totalBelumLapor = 0;
        const processedPatients = [];
        const nowWib = new Date(new Date().getTime() + 7 * 3600 * 1000);
        const todayWib = new Date(nowWib);
        todayWib.setUTCHours(0, 0, 0, 0);
        const todayStr = nowWib.toISOString().split('T')[0];
        for (const p of pairings) {
            const patientId = p.patientId;
            const schedulesToday = await this.scheduleService.getSchedulesByUser(patientId.toString());
            const evidences = await this.evidenceService.getEvidenceByUser(patientId.toString());
            const evidencesToday = evidences.filter((e) => {
                const evWib = new Date(new Date(e.uploadedAt).getTime() + 7 * 3600 * 1000);
                return evWib.toISOString().split('T')[0] === todayStr;
            });
            let perluVerifikasiCount = 0;
            let belumLaporCount = 0;
            for (const sched of schedulesToday) {
                const ev = evidencesToday.find((e) => e.scheduleId === sched.templateId?.toString() ||
                    e.scheduleId === sched.id.toString());
                if (!ev) {
                    belumLaporCount++;
                }
                else if (ev.status === 'pending') {
                    perluVerifikasiCount++;
                }
            }
            totalPerluVerifikasi += perluVerifikasiCount;
            totalBelumLapor += belumLaporCount;
            let statusString = '';
            if (perluVerifikasiCount === 0 && belumLaporCount === 0) {
                if (schedulesToday.length === 0) {
                    statusString = 'Tidak ada jadwal hari ini';
                }
                else {
                    statusString = 'Tuntas Hari Ini ✅';
                }
            }
            else {
                const statuses = [];
                if (perluVerifikasiCount > 0)
                    statuses.push(`Perlu Verifikasi (${perluVerifikasiCount})`);
                if (belumLaporCount > 0)
                    statuses.push(`Belum Lapor (${belumLaporCount})`);
                statusString = statuses.join(' | ');
            }
            processedPatients.push({
                id: patientId.toString(),
                name: p.patient.name,
                status: statusString,
                phone: p.patient.phone ?? null,
                address: p.patient.address ?? null,
            });
        }
        const allPending = await this.getPendingEvidence(pmoId);
        const pendingPastDays = allPending.filter((e) => {
            const evWib = new Date(new Date(e.uploadedAt).getTime() + 7 * 3600 * 1000);
            return (evWib.toISOString().split('T')[0] !== todayStr && e.status === 'pending');
        });
        totalPerluVerifikasi += pendingPastDays.length;
        return {
            totalPasien,
            perluVerifikasi: totalPerluVerifikasi,
            belumLapor: totalBelumLapor,
            patients: processedPatients,
        };
    }
    async unpairPatient(pairingId) {
        const pairing = await this.pmoPatientRepository.findOne({
            where: { id: parseInt(pairingId) },
        });
        if (pairing) {
            pairing.status = 'inactive';
            await this.pmoPatientRepository.save(pairing);
        }
    }
    async unpairPatientByPmoAndPatient(pmoId, patientId) {
        const pairing = await this.pmoPatientRepository.findOne({
            where: {
                pmoId: parseInt(pmoId),
                patientId: parseInt(patientId),
                status: 'active',
            },
        });
        if (pairing) {
            pairing.status = 'inactive';
            await this.pmoPatientRepository.save(pairing);
        }
    }
    async verifyEvidence(pmoId, verificationDto) {
        const evidenceId = verificationDto.evidenceId;
        const verified = verificationDto.approved;
        const verifiedBy = pmoId;
        const evidence = await this.evidenceService.verifyEvidence(evidenceId, {
            verified,
            verifiedBy,
        });
        if (verified && evidence.userId) {
            const patientId = evidence.userId.toString();
            const wibOffsetMs = 7 * 60 * 60 * 1000;
            const schedules = await this.scheduleService.getSchedulesByUser(patientId);
            const evWib = new Date(new Date(evidence.uploadedAt).getTime() + wibOffsetMs);
            const evDateStr = evWib.toISOString().split('T')[0];
            const evidences = await this.evidenceService.getEvidenceByUser(patientId);
            const evidencesForDay = evidences.filter((e) => {
                const ew = new Date(new Date(e.uploadedAt).getTime() + wibOffsetMs);
                return ew.toISOString().split('T')[0] === evDateStr;
            });
            let allVerified = true;
            if (schedules.length > 0) {
                for (const sched of schedules) {
                    const ev = evidencesForDay.find((e) => String(e.scheduleId) === String(sched.templateId) ||
                        String(e.scheduleId) === String(sched.id));
                    if (!ev || !ev.verified) {
                        allVerified = false;
                        break;
                    }
                }
            }
            else {
                allVerified = false;
            }
            if (allVerified) {
                await this.gamificationService.addPoints(patientId, 10, new Date(evidence.uploadedAt));
            }
        }
        return {
            message: 'Evidence verified successfully',
            data: {
                evidenceId,
                approved: verified,
                reason: verificationDto.reason,
                verifiedAt: evidence.verifiedAt,
            },
        };
    }
    async deleteByUserId(userId) {
        await this.pmoPatientRepository.delete({ pmoId: parseInt(userId) });
        await this.pmoPatientRepository.delete({ patientId: parseInt(userId) });
    }
    async remindPatient(pmoId, patientId) {
        const pair = await this.pmoPatientRepository.findOne({
            where: {
                pmoId: parseInt(pmoId),
                patientId: parseInt(patientId),
                status: 'active',
            },
            relations: ['pmo', 'patient'],
        });
        if (!pair || !pair.patient) {
            throw new common_1.NotFoundException('Patient pairing not found or inactive');
        }
        if (pair.patient.deviceToken) {
            await this.firebaseService.sendPushNotification(pair.patient.deviceToken, 'Pesan dari PMO! 🔔', `Halo! PMO Anda (${pair.pmo.name}) mengingatkan untuk segera meminum obat dan mengunggah buktinya hari ini.`, {
                type: 'pmo_reminder',
                pmoId: pair.pmo.id.toString(),
                sentAt: Date.now().toString(),
            });
            console.log(`[PMO Service] Manual reminder sent from PMO ${pair.pmo.name} to patient ${pair.patient.name}`);
        }
    }
};
exports.PMOService = PMOService;
exports.PMOService = PMOService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pmo_patient_entity_1.PmoPatient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        evidence_service_1.EvidenceService,
        gamification_service_1.GamificationService,
        schedules_service_1.ScheduleService,
        firebase_service_1.FirebaseService])
], PMOService);
//# sourceMappingURL=pmo.service.js.map