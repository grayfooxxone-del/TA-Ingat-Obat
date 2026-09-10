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
exports.MedicineController = void 0;
const common_1 = require("@nestjs/common");
const medicines_service_1 = require("./medicines.service");
const medicine_dto_1 = require("../../common/dtos/medicine.dto");
let MedicineController = class MedicineController {
    constructor(medicineService) {
        this.medicineService = medicineService;
    }
    async createMedicine(createMedicineDto) {
        const medicine = await this.medicineService.createMedicine(createMedicineDto);
        return {
            message: 'Medicine created successfully',
            data: medicine,
        };
    }
    async getMedicinesByUser(userId) {
        const medicines = await this.medicineService.getMedicinesByUser(userId);
        return {
            data: medicines,
        };
    }
    async getMedicineById(medicineId) {
        const medicine = await this.medicineService.getMedicineById(medicineId);
        return {
            data: medicine,
        };
    }
    async updateMedicine(medicineId, updateMedicineDto) {
        const medicine = await this.medicineService.updateMedicine(medicineId, updateMedicineDto);
        return {
            message: 'Medicine updated successfully',
            data: medicine,
        };
    }
    async deleteMedicine(medicineId) {
        await this.medicineService.deleteMedicine(medicineId);
        return {
            message: 'Medicine deleted successfully',
        };
    }
};
exports.MedicineController = MedicineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medicine_dto_1.CreateMedicineDto]),
    __metadata("design:returntype", Promise)
], MedicineController.prototype, "createMedicine", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicineController.prototype, "getMedicinesByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicineController.prototype, "getMedicineById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, medicine_dto_1.UpdateMedicineDto]),
    __metadata("design:returntype", Promise)
], MedicineController.prototype, "updateMedicine", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicineController.prototype, "deleteMedicine", null);
exports.MedicineController = MedicineController = __decorate([
    (0, common_1.Controller)('medicines'),
    __metadata("design:paramtypes", [medicines_service_1.MedicineService])
], MedicineController);
//# sourceMappingURL=medicines.controller.js.map