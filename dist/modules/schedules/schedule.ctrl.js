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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const schedules_service_1 = require("./schedules.service");
const schedules_dto_1 = require("../../common/dtos/schedules.dto");
let ScheduleController = class ScheduleController {
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    async createSchedule(createScheduleDto) {
        const schedule = await this.scheduleService.createSchedule(createScheduleDto);
        return {
            message: 'Schedule created successfully',
            data: schedule,
        };
    }
    async getSchedulesByUser(userId) {
        const schedules = await this.scheduleService.getSchedulesByUser(userId);
        return {
            data: schedules,
        };
    }
    async getSchedulesByMedicine(medicineId) {
        const schedules = await this.scheduleService.getSchedulesByMedicine(medicineId);
        return {
            data: schedules,
        };
    }
    async getScheduleById(scheduleId) {
        const schedule = await this.scheduleService.getScheduleById(scheduleId);
        return {
            data: schedule,
        };
    }
    async updateSchedule(scheduleId, updateScheduleDto) {
        const schedule = await this.scheduleService.updateSchedule(scheduleId, updateScheduleDto);
        return {
            message: 'Schedule updated successfully',
            data: schedule,
        };
    }
    async deleteSchedule(scheduleId) {
        await this.scheduleService.deleteSchedule(scheduleId);
        return {
            message: 'Schedule deleted successfully',
        };
    }
    async getComplianceReport(userId, month, year) {
        const report = await this.scheduleService.getComplianceReport(userId, month, year);
        return {
            data: report,
        };
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedules_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedulesByUser", null);
__decorate([
    (0, common_1.Get)('medicine/:medicineId'),
    __param(0, (0, common_1.Param)('medicineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedulesByMedicine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getScheduleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedules_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Get)('compliance/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getComplianceReport", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, common_1.Controller)('schedules'),
    __metadata("design:paramtypes", [schedules_service_1.ScheduleService])
], ScheduleController);
//# sourceMappingURL=schedule.ctrl.js.map