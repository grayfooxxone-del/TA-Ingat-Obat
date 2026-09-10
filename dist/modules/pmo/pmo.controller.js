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
exports.PMOController = void 0;
const common_1 = require("@nestjs/common");
const pmo_service_1 = require("./pmo.service");
let PMOController = class PMOController {
    constructor(pmoService) {
        this.pmoService = pmoService;
    }
    async pairPatient(body) {
        return await this.pmoService.pairPatient(body.pmoId, body.pairPatientDto);
    }
    async getMonitoredPatients(pmoId) {
        const patients = await this.pmoService.getMonitoredPatients(pmoId);
        return {
            data: patients,
        };
    }
    async getConnectedPMOs(patientId) {
        const pmos = await this.pmoService.getConnectedPMOs(patientId);
        return {
            data: pmos,
        };
    }
    async getDashboardData(pmoId) {
        const data = await this.pmoService.getDashboardData(pmoId);
        return {
            data: data,
        };
    }
    async getPendingEvidence(pmoId) {
        const evidence = await this.pmoService.getPendingEvidence(pmoId);
        return {
            data: evidence,
        };
    }
    async unpairPatient(pairingId) {
        await this.pmoService.unpairPatient(pairingId);
        return {
            message: 'Patient unpaired successfully',
        };
    }
    async unpairPatientByPmoAndPatient(pmoId, patientId) {
        await this.pmoService.unpairPatientByPmoAndPatient(pmoId, patientId);
        return {
            message: 'Patient unpaired successfully',
        };
    }
    async verifyEvidence(body) {
        return await this.pmoService.verifyEvidence(body.pmoId, body.verificationDto);
    }
    async remindPatient(body) {
        await this.pmoService.remindPatient(body.pmoId, body.patientId);
        return {
            message: 'Reminder sent successfully',
        };
    }
};
exports.PMOController = PMOController;
__decorate([
    (0, common_1.Post)('pair-patient'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "pairPatient", null);
__decorate([
    (0, common_1.Get)(':pmoId/monitored-patients'),
    __param(0, (0, common_1.Param)('pmoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "getMonitoredPatients", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "getConnectedPMOs", null);
__decorate([
    (0, common_1.Get)(':pmoId/dashboard'),
    __param(0, (0, common_1.Param)('pmoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Get)(':pmoId/evidence'),
    __param(0, (0, common_1.Param)('pmoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "getPendingEvidence", null);
__decorate([
    (0, common_1.Delete)('pairing/:pairingId'),
    __param(0, (0, common_1.Param)('pairingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "unpairPatient", null);
__decorate([
    (0, common_1.Delete)(':pmoId/patient/:patientId'),
    __param(0, (0, common_1.Param)('pmoId')),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "unpairPatientByPmoAndPatient", null);
__decorate([
    (0, common_1.Post)('verify-evidence'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Post)('remind-patient'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PMOController.prototype, "remindPatient", null);
exports.PMOController = PMOController = __decorate([
    (0, common_1.Controller)('pmo'),
    __metadata("design:paramtypes", [pmo_service_1.PMOService])
], PMOController);
//# sourceMappingURL=pmo.controller.js.map