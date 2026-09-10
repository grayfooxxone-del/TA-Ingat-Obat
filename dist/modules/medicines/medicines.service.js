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
exports.MedicineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const medicine_entity_1 = require("./entities/medicine.entity");
let MedicineService = class MedicineService {
    constructor(medicineRepository) {
        this.medicineRepository = medicineRepository;
    }
    async createMedicine(createMedicineDto) {
        const medicine = this.medicineRepository.create({
            userId: parseInt(createMedicineDto.userId),
            medicineName: createMedicineDto.medicineName,
            dosage: createMedicineDto.dosage || '-',
            unit: createMedicineDto.unit || 'tablet',
            frequency: createMedicineDto.frequency || 'once',
        });
        const saved = await this.medicineRepository.save(medicine);
        return this.toDto(saved);
    }
    async getMedicinesByUser(userId) {
        const medicines = await this.medicineRepository.find({
            where: { userId: parseInt(userId) },
            order: { createdAt: 'DESC' },
        });
        return medicines.map((m) => this.toDto(m));
    }
    async getMedicineById(medicineId) {
        const medicine = await this.medicineRepository.findOne({
            where: { id: parseInt(medicineId) },
        });
        if (!medicine)
            throw new common_1.NotFoundException('Medicine tidak ditemukan');
        return this.toDto(medicine);
    }
    async updateMedicine(medicineId, updateMedicineDto) {
        const medicine = await this.medicineRepository.findOne({
            where: { id: parseInt(medicineId) },
        });
        if (!medicine)
            throw new common_1.NotFoundException('Medicine tidak ditemukan');
        Object.assign(medicine, updateMedicineDto);
        const updated = await this.medicineRepository.save(medicine);
        return this.toDto(updated);
    }
    async deleteMedicine(medicineId) {
        await this.medicineRepository.delete(parseInt(medicineId));
    }
    async deleteByUserId(userId) {
        await this.medicineRepository.delete({ userId: parseInt(userId) });
    }
    toDto(medicine) {
        return {
            id: medicine.id.toString(),
            userId: medicine.userId.toString(),
            medicineName: medicine.medicineName,
            dosage: medicine.dosage,
            unit: medicine.unit,
            frequency: medicine.frequency,
            createdAt: medicine.createdAt,
            updatedAt: medicine.updatedAt,
        };
    }
};
exports.MedicineService = MedicineService;
exports.MedicineService = MedicineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medicine_entity_1.Medicine)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MedicineService);
//# sourceMappingURL=medicines.service.js.map