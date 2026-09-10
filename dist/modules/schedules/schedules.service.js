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
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_entity_1 = require("./entities/schedule.entity");
const evidence_entity_1 = require("../evidence/entities/evidence.entity");
let ScheduleService = class ScheduleService {
    constructor(scheduleRepository, evidenceRepository) {
        this.scheduleRepository = scheduleRepository;
        this.evidenceRepository = evidenceRepository;
    }
    async createSchedule(createScheduleDto) {
        const schedule = this.scheduleRepository.create({
            userId: parseInt(createScheduleDto.userId),
            medicineId: createScheduleDto.medicineId
                ? parseInt(createScheduleDto.medicineId)
                : null,
            medicineName: createScheduleDto.medicineName,
            dosage: createScheduleDto.dosage,
            frequency: createScheduleDto.frequency,
            time: createScheduleDto.time,
            day: createScheduleDto.day,
            notes: createScheduleDto.notes,
            completed: false,
        });
        const saved = await this.scheduleRepository.save(schedule);
        return this.toDto(saved);
    }
    async getSchedulesByUser(userId) {
        const schedules = await this.scheduleRepository.find({
            where: { userId: parseInt(userId) },
            order: { createdAt: 'DESC' },
        });
        if (schedules.length === 0)
            return [];
        const evidences = await this.evidenceRepository.find({
            where: schedules.map((s) => ({ scheduleId: s.id })),
        });
        const nowUtc = new Date();
        const wibOffsetMs = 7 * 60 * 60 * 1000;
        const nowWib = new Date(nowUtc.getTime() + wibOffsetMs);
        const todayStr = nowWib.toISOString().split('T')[0];
        for (const s of schedules) {
            const evToday = evidences.find((e) => {
                if (e.scheduleId !== s.id)
                    return false;
                const evDateUtc = new Date(e.createdAt);
                const evDateWib = new Date(evDateUtc.getTime() + wibOffsetMs);
                return evDateWib.toISOString().split('T')[0] === todayStr;
            });
            if (evToday) {
                s.completed = true;
                const schedTime = s.time;
                const schedDateWibStr = `${todayStr}T${schedTime}:00+07:00`;
                const schedDateExact = new Date(schedDateWibStr);
                const uploadDate = new Date(evToday.createdAt);
                const diffMins = (uploadDate.getTime() - schedDateExact.getTime()) / 60000;
                if (diffMins <= 30 && diffMins >= -60) {
                    s.status = 'Tepat Waktu';
                }
                else {
                    s.status = 'Terlambat';
                }
            }
            else {
                s.completed = false;
                s.status = 'Menunggu';
            }
        }
        return schedules.map((s) => this.toDto(s));
    }
    async getSchedulesByMedicine(medicineId) {
        const schedules = await this.scheduleRepository.find({
            where: { medicineId: parseInt(medicineId) },
        });
        return schedules.map((s) => this.toDto(s));
    }
    async getScheduleById(scheduleId) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id: parseInt(scheduleId) },
        });
        if (!schedule)
            throw new common_1.NotFoundException('Jadwal tidak ditemukan');
        return this.toDto(schedule);
    }
    async updateSchedule(scheduleId, updateScheduleDto) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id: parseInt(scheduleId) },
        });
        if (!schedule)
            throw new common_1.NotFoundException('Jadwal tidak ditemukan');
        if (updateScheduleDto.medicineId !== undefined) {
            schedule.medicineId = updateScheduleDto.medicineId
                ? parseInt(updateScheduleDto.medicineId)
                : null;
        }
        const wasCompleted = updateScheduleDto.completed === true && !schedule.completed;
        if (updateScheduleDto.time !== undefined)
            schedule.time = updateScheduleDto.time;
        if (updateScheduleDto.day !== undefined)
            schedule.day = updateScheduleDto.day;
        if (updateScheduleDto.medicineName !== undefined)
            schedule.medicineName = updateScheduleDto.medicineName;
        if (updateScheduleDto.dosage !== undefined)
            schedule.dosage = updateScheduleDto.dosage;
        if (updateScheduleDto.frequency !== undefined)
            schedule.frequency = updateScheduleDto.frequency;
        if (updateScheduleDto.status !== undefined)
            schedule.status = updateScheduleDto.status;
        if (wasCompleted) {
            schedule.completed = true;
            schedule.completedAt = new Date();
        }
        const updated = await this.scheduleRepository.save(schedule);
        return this.toDto(updated);
    }
    async deleteSchedule(scheduleId) {
        await this.scheduleRepository.softDelete(parseInt(scheduleId));
    }
    async deleteByUserId(userId) {
        await this.scheduleRepository.delete({ userId: parseInt(userId) });
    }
    async resetUserSchedulesAndEvidence(userId) {
        const userIdNum = parseInt(userId);
        await this.evidenceRepository.delete({ userId: userIdNum });
        const schedules = await this.scheduleRepository.find({
            where: { userId: userIdNum },
        });
        for (const schedule of schedules) {
            schedule.completed = false;
            schedule.completedAt = null;
            schedule.status = 'Menunggu';
            await this.scheduleRepository.save(schedule);
        }
    }
    async getComplianceReport(userId, month, year) {
        const allSchedules = await this.scheduleRepository.find({
            where: { userId: parseInt(userId) },
            order: { createdAt: 'ASC', time: 'ASC' },
            withDeleted: true,
        });
        const evidences = await this.evidenceRepository.find({
            where: { userId: parseInt(userId) },
            order: { createdAt: 'ASC' },
        });
        const wibOffsetMs = 7 * 60 * 60 * 1000;
        const nowWib = new Date(new Date().getTime() + wibOffsetMs);
        const todayStr = nowWib.toISOString().split('T')[0];
        const evMap = new Map();
        for (const ev of evidences) {
            const evDateWib = new Date(new Date(ev.createdAt).getTime() + wibOffsetMs);
            const evDateStr = evDateWib.toISOString().split('T')[0];
            const key = `${ev.scheduleId}-${evDateStr}`;
            if (!evMap.has(key)) {
                evMap.set(key, ev);
            }
        }
        let startDateStr = todayStr;
        if (allSchedules.length > 0) {
            const firstCreated = new Date(new Date(allSchedules[0].createdAt).getTime() + wibOffsetMs);
            startDateStr = firstCreated.toISOString().split('T')[0];
        }
        const targetMonthEnd = new Date(year, month, 0);
        let endDateStr = targetMonthEnd.toISOString().split('T')[0];
        if (year > nowWib.getFullYear() || (year === nowWib.getFullYear() && month >= nowWib.getMonth() + 1)) {
            endDateStr = todayStr;
        }
        const allDates = [];
        let currDate = new Date(startDateStr);
        const endDateObj = new Date(endDateStr);
        while (currDate <= endDateObj) {
            allDates.push(currDate.toISOString().split('T')[0]);
            currDate.setDate(currDate.getDate() + 1);
        }
        const fullHistory = [];
        let currentStreak = 0;
        for (const dateStr of allDates) {
            const activeSchedulesForDay = allSchedules.filter(s => {
                const createdDateWib = new Date(new Date(s.createdAt).getTime() + wibOffsetMs);
                const createdDateStr = createdDateWib.toISOString().split('T')[0];
                if (dateStr < createdDateStr)
                    return false;
                if (s.deletedAt) {
                    const deletedDateWib = new Date(new Date(s.deletedAt).getTime() + wibOffsetMs);
                    const deletedDateStr = deletedDateWib.toISOString().split('T')[0];
                    if (dateStr > deletedDateStr)
                        return false;
                }
                return true;
            });
            if (activeSchedulesForDay.length === 0)
                continue;
            let allCompletedOnTimeOrLate = true;
            const dayEntries = [];
            for (const s of activeSchedulesForDay) {
                const ev = evMap.get(`${s.id}-${dateStr}`);
                let status = 'Menunggu';
                let uploadedAt = '-';
                let isCompleted = false;
                if (ev) {
                    const schedDateWibStr = `${dateStr}T${s.time}:00+07:00`;
                    const schedDateExact = new Date(schedDateWibStr);
                    const uploadDate = new Date(ev.createdAt);
                    const diffMins = (uploadDate.getTime() - schedDateExact.getTime()) / 60000;
                    status = diffMins <= 30 && diffMins >= -60 ? 'Tepat Waktu' : 'Terlambat';
                    uploadedAt = new Date(ev.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
                    isCompleted = true;
                }
                else {
                    const dateObj = new Date(dateStr);
                    const nowDateObj = new Date(todayStr);
                    if (dateObj < nowDateObj) {
                        status = 'Terlewat';
                    }
                    else {
                        status = 'Menunggu';
                    }
                    if (status === 'Terlewat') {
                        allCompletedOnTimeOrLate = false;
                    }
                }
                dayEntries.push({
                    dateStr,
                    date: new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                    time: s.time,
                    medicine: s.medicineName || 'Obat',
                    status,
                    uploadedAt,
                    scheduleId: s.id,
                });
            }
            const hasMenunggu = dayEntries.some(e => e.status === 'Menunggu');
            const hasTerlewat = dayEntries.some(e => e.status === 'Terlewat');
            if (hasTerlewat) {
                currentStreak = 0;
            }
            else if (!hasMenunggu && dayEntries.length > 0) {
                currentStreak += 1;
            }
            for (const entry of dayEntries) {
                entry.streakCount = currentStreak;
                fullHistory.push(entry);
            }
        }
        const requestedMonthStr = `${year}-${month.toString().padStart(2, '0')}`;
        const history = fullHistory.filter(h => h.dateStr.startsWith(requestedMonthStr));
        const total = history.length;
        let onTime = 0, late = 0, missed = 0, pending = 0;
        history.forEach((h) => {
            if (h.status === 'Tepat Waktu')
                onTime++;
            else if (h.status === 'Terlambat')
                late++;
            else if (h.status === 'Terlewat')
                missed++;
            else
                pending++;
        });
        const completed = onTime + late;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
            userId,
            month,
            year,
            totalSchedules: total,
            completedSchedules: completed,
            onTimeSchedules: onTime,
            lateSchedules: late,
            missedSchedules: missed,
            pendingSchedules: pending,
            complianceRate: rate,
            history,
        };
    }
    toDto(schedule) {
        return {
            id: schedule.id.toString(),
            medicineId: schedule.medicineId?.toString(),
            userId: schedule.userId.toString(),
            medicineName: schedule.medicineName,
            dosage: schedule.dosage,
            frequency: schedule.frequency,
            time: schedule.time,
            day: schedule.day,
            notes: schedule.notes,
            completed: schedule.completed,
            completedAt: schedule.completedAt,
            status: schedule.status,
            createdAt: schedule.createdAt,
            updatedAt: schedule.updatedAt,
        };
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(1, (0, typeorm_1.InjectRepository)(evidence_entity_1.Evidence)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ScheduleService);
//# sourceMappingURL=schedules.service.js.map