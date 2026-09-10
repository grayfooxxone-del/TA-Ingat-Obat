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
exports.EvidenceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const evidence_service_1 = require("./evidence.service");
const evidence_dto_1 = require("../../common/dtos/evidence.dto");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let EvidenceController = class EvidenceController {
    constructor(evidenceService, cloudinaryService) {
        this.evidenceService = evidenceService;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadEvidence(createEvidenceDto, file) {
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            if ('secure_url' in uploadResult) {
                createEvidenceDto.fileUrl = uploadResult.secure_url;
            }
        }
        if (!createEvidenceDto.fileUrl) {
            throw new common_1.BadRequestException('File bukti harus diunggah atau URL bukti harus disediakan');
        }
        const evidence = await this.evidenceService.uploadEvidence(createEvidenceDto);
        return {
            message: 'Evidence uploaded successfully',
            data: evidence,
        };
    }
    async getEvidenceByUser(userId) {
        const evidences = await this.evidenceService.getEvidenceByUser(userId);
        return {
            data: evidences,
        };
    }
    async getEvidenceById(evidenceId) {
        const evidence = await this.evidenceService.getEvidenceById(evidenceId);
        return {
            data: evidence,
        };
    }
    async verifyEvidence(evidenceId, updateEvidenceDto) {
        const evidence = await this.evidenceService.verifyEvidence(evidenceId, updateEvidenceDto);
        return {
            message: 'Evidence verified successfully',
            data: evidence,
        };
    }
    async getPendingEvidenceForPMO() {
        const evidences = await this.evidenceService.getPendingEvidenceForPMO();
        return {
            data: evidences,
        };
    }
};
exports.EvidenceController = EvidenceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evidence_dto_1.CreateEvidenceDto, Object]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "uploadEvidence", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "getEvidenceByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "getEvidenceById", null);
__decorate([
    (0, common_1.Put)(':id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evidence_dto_1.UpdateEvidenceDto]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)('pmo/:pmoId/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "getPendingEvidenceForPMO", null);
exports.EvidenceController = EvidenceController = __decorate([
    (0, common_1.Controller)('evidence'),
    __metadata("design:paramtypes", [evidence_service_1.EvidenceService,
        cloudinary_service_1.CloudinaryService])
], EvidenceController);
//# sourceMappingURL=evidence.controller.js.map