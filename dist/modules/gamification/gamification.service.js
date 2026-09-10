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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedules_service_1 = require("../schedules/schedules.service");
const gamification_entity_1 = require("./entities/gamification.entity");
const pmo_patient_entity_1 = require("../pmo/entities/pmo-patient.entity");
const evidence_entity_1 = require("../evidence/entities/evidence.entity");
let GamificationService = class GamificationService {
    constructor(gamificationRepository, pmoPatientRepository, evidenceRepository, scheduleService) {
        this.gamificationRepository = gamificationRepository;
        this.pmoPatientRepository = pmoPatientRepository;
        this.evidenceRepository = evidenceRepository;
        this.scheduleService = scheduleService;
        this.POINTS_PER_DAY = 10;
        this.MAX_POINTS = 1800;
        this.BADGE_THRESHOLDS = [
            { name: 'Langkah Awal', icon: '🥉', points: 0 },
            { name: 'Pejuang Bulan Pertama', icon: '🥉', points: 300 },
            { name: 'Lulus Fase Intensif', icon: '🥈', points: 600 },
            { name: 'Setengah Jalan', icon: '🥇', points: 900 },
            { name: 'Pejuang Konsisten', icon: '💎', points: 1200 },
            { name: 'Hampir Selesai', icon: '💎', points: 1500 },
            { name: 'Pahlawan Sehat', icon: '👑', points: 1800 },
        ];
    }
    async createGamification(createGamificationDto) {
        const userIdNum = parseInt(createGamificationDto.userId, 10);
        let gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (!gamification) {
            gamification = this.gamificationRepository.create({
                userId: userIdNum,
                points: createGamificationDto.points || 0,
                currentStreak: 0,
                longestStreak: 0,
                lastStreakUpdate: new Date(),
            });
            gamification = await this.gamificationRepository.save(gamification);
        }
        return this.toResponseDto(gamification);
    }
    async getGamificationByUser(userId) {
        const userIdNum = parseInt(userId, 10);
        const pairing = await this.pmoPatientRepository.findOne({
            where: { patientId: userIdNum, status: 'active' },
        });
        if (!pairing) {
            return {
                id: 'unpaired',
                userId,
                points: 0,
                streak: {
                    current: 0,
                    longest: 0,
                    lastUpdated: new Date(),
                },
                compliancePercentage: 0,
                badges: this.generateBadgesForPoints(0),
                createdAt: new Date(),
            };
        }
        await this.syncPoints(userId);
        const gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (!gamification) {
            return await this.createGamification({ userId, points: 0 });
        }
        const today = new Date();
        const lastUpdate = gamification.lastStreakUpdate || today;
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
        const diffTime = Math.abs(todayDate.getTime() - lastUpdateDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        let currentStreakToDisplay = gamification.currentStreak;
        if (diffDays > 1) {
            currentStreakToDisplay = 0;
        }
        const response = this.toResponseDto(gamification);
        response.streak.current = currentStreakToDisplay;
        return response;
    }
    async addPoints(userId, pointsToAdd, actionDate = new Date()) {
        const userIdNum = parseInt(userId, 10);
        let gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (!gamification) {
            gamification = this.gamificationRepository.create({
                userId: userIdNum,
                points: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastStreakUpdate: new Date(0),
            });
        }
        const today = actionDate;
        const lastUpdate = gamification.lastStreakUpdate || new Date(0);
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
        const diffTime = todayDate.getTime() - lastUpdateDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0 && gamification.points > 0) {
            return this.toResponseDto(gamification);
        }
        gamification.points = Math.min(gamification.points + pointsToAdd, this.MAX_POINTS);
        if (diffDays === 1) {
            gamification.currentStreak += 1;
        }
        else if (diffDays > 1) {
            gamification.currentStreak = 1;
        }
        else if (diffDays < 0) {
        }
        else if (diffDays === 0 && gamification.points === pointsToAdd) {
            gamification.currentStreak = 1;
        }
        if (diffDays >= 0) {
            gamification.lastStreakUpdate = actionDate;
        }
        if (gamification.currentStreak > gamification.longestStreak) {
            gamification.longestStreak = gamification.currentStreak;
        }
        const saved = await this.gamificationRepository.save(gamification);
        return this.toResponseDto(saved);
    }
    async syncPoints(userId) {
        const userIdNum = parseInt(userId, 10);
        const wibOffsetMs = 7 * 60 * 60 * 1000;
        const schedules = await this.scheduleService.getSchedulesByUser(userId);
        if (schedules.length === 0) {
            const g = await this.gamificationRepository.findOne({
                where: { userId: userIdNum },
            });
            return g
                ? this.toResponseDto(g)
                : await this.createGamification({ userId, points: 0 });
        }
        const verifiedEvidences = await this.evidenceRepository.find({
            where: { userId: userIdNum, verified: true },
            order: { createdAt: 'ASC' },
        });
        const dayMap = new Map();
        for (const ev of verifiedEvidences) {
            const evWib = new Date(new Date(ev.createdAt).getTime() + wibOffsetMs);
            const dayStr = evWib.toISOString().split('T')[0];
            if (!dayMap.has(dayStr))
                dayMap.set(dayStr, []);
            dayMap.get(dayStr).push(ev);
        }
        let gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (!gamification) {
            gamification = this.gamificationRepository.create({
                userId: userIdNum,
                points: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastStreakUpdate: new Date(0),
            });
            gamification = await this.gamificationRepository.save(gamification);
        }
        const lastRewardWib = new Date(new Date(gamification.lastStreakUpdate || new Date(0)).getTime() +
            wibOffsetMs);
        const lastRewardStr = lastRewardWib.toISOString().split('T')[0];
        const rewardDays = [];
        for (const [dayStr, dayEvidences] of dayMap.entries()) {
            if (dayStr <= lastRewardStr && gamification.points > 0)
                continue;
            let allDone = true;
            for (const sched of schedules) {
                const found = dayEvidences.find((e) => String(e.scheduleId) === String(sched.templateId) ||
                    String(e.scheduleId) === String(sched.id));
                if (!found) {
                    allDone = false;
                    break;
                }
            }
            if (allDone)
                rewardDays.push(dayStr);
        }
        if (rewardDays.length === 0) {
            return this.toResponseDto(gamification);
        }
        const sortedDays = rewardDays.sort();
        let result = this.toResponseDto(gamification);
        for (const dayStr of sortedDays) {
            result = await this.addPoints(userId, 10, new Date(`${dayStr}T12:00:00+07:00`));
        }
        return result;
    }
    async resetStreak(userId) {
        const userIdNum = parseInt(userId, 10);
        const gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (gamification) {
            gamification.currentStreak = 0;
            gamification.lastStreakUpdate = new Date();
            const saved = await this.gamificationRepository.save(gamification);
            return this.toResponseDto(saved);
        }
        return await this.getGamificationByUser(userId);
    }
    async resetGamification(userId) {
        const userIdNum = parseInt(userId, 10);
        await this.scheduleService.resetUserSchedulesAndEvidence(userId);
        const gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (gamification) {
            gamification.points = 0;
            gamification.currentStreak = 0;
            gamification.longestStreak = 0;
            gamification.lastStreakUpdate = new Date();
            const saved = await this.gamificationRepository.save(gamification);
            return this.toResponseDto(saved);
        }
        return await this.getGamificationByUser(userId);
    }
    async checkMonthlyReward(userId) {
        const userIdNum = parseInt(userId, 10);
        const gamification = await this.gamificationRepository.findOne({
            where: { userId: userIdNum },
        });
        if (!gamification) {
            return await this.getGamificationByUser(userId);
        }
        return this.toResponseDto(gamification);
    }
    toResponseDto(entity) {
        const points = entity.points;
        const compliancePercentage = Math.min((points / this.MAX_POINTS) * 100, 100);
        const badges = this.generateBadgesForPoints(points);
        return {
            id: entity.id.toString(),
            userId: entity.userId.toString(),
            points: entity.points,
            streak: {
                current: entity.currentStreak,
                longest: entity.longestStreak,
                lastUpdated: entity.lastStreakUpdate,
            },
            compliancePercentage,
            badges,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    generateBadgesForPoints(points) {
        const badges = [];
        for (const threshold of this.BADGE_THRESHOLDS) {
            if (points >= threshold.points) {
                badges.push({
                    id: `badge-${threshold.name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: threshold.name,
                    description: `Mencapai ${threshold.points} poin`,
                    icon: threshold.icon,
                    achieved: true,
                    achievedAt: new Date(),
                });
            }
        }
        return badges;
    }
    async deleteByUserId(userId) {
        const userIdNum = parseInt(userId, 10);
        await this.gamificationRepository.delete({ userId: userIdNum });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gamification_entity_1.Gamification)),
    __param(1, (0, typeorm_1.InjectRepository)(pmo_patient_entity_1.PmoPatient)),
    __param(2, (0, typeorm_1.InjectRepository)(evidence_entity_1.Evidence)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        schedules_service_1.ScheduleService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map