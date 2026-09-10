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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
const gamification_dto_1 = require("../../common/dtos/gamification.dto");
let GamificationController = class GamificationController {
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async createGamification(createGamificationDto) {
        const gamification = await this.gamificationService.createGamification(createGamificationDto);
        return {
            message: 'Gamification created successfully',
            data: gamification,
        };
    }
    async getGamificationByUserAlias(userId) {
        const gamification = await this.gamificationService.getGamificationByUser(userId);
        return {
            message: 'Gamification data retrieved successfully',
            data: gamification,
        };
    }
    async getGamificationByUser(userId) {
        const gamification = await this.gamificationService.getGamificationByUser(userId);
        return {
            message: 'Gamification data retrieved successfully',
            data: gamification,
        };
    }
    async addPoints(userId, body) {
        const gamification = await this.gamificationService.addPoints(userId, body.points);
        return {
            message: 'Points added successfully',
            data: gamification,
        };
    }
    async resetStreak(userId) {
        const gamification = await this.gamificationService.resetStreak(userId);
        return {
            message: 'Streak reset successfully',
            data: gamification,
        };
    }
    async resetGamification(userId) {
        const gamification = await this.gamificationService.resetGamification(userId);
        return {
            message: 'Gamification reset successfully',
            data: gamification,
        };
    }
    async checkMonthlyReward(userId) {
        const gamification = await this.gamificationService.checkMonthlyReward(userId);
        return {
            message: 'Monthly reward checked',
            data: gamification,
        };
    }
    async syncPoints(userId) {
        const gamification = await this.gamificationService.syncPoints(userId);
        return {
            message: 'Points synced from verified evidence',
            data: gamification,
        };
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamification_dto_1.CreateGamificationDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createGamification", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getGamificationByUserAlias", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getGamificationByUser", null);
__decorate([
    (0, common_1.Put)(':userId/add-points'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "addPoints", null);
__decorate([
    (0, common_1.Put)(':userId/reset-streak'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "resetStreak", null);
__decorate([
    (0, common_1.Put)(':userId/reset'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "resetGamification", null);
__decorate([
    (0, common_1.Post)(':userId/check-monthly-reward'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "checkMonthlyReward", null);
__decorate([
    (0, common_1.Post)(':userId/sync'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "syncPoints", null);
exports.GamificationController = GamificationController = __decorate([
    (0, common_1.Controller)('gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map