import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import {
  CreateMedicineDto,
  UpdateMedicineDto,
  MedicineResponseDto,
} from '../../common/dtos/medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async createMedicine(
    createMedicineDto: CreateMedicineDto,
  ): Promise<MedicineResponseDto> {
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

  async getMedicinesByUser(userId: string): Promise<MedicineResponseDto[]> {
    const medicines = await this.medicineRepository.find({
      where: { userId: parseInt(userId) },
      order: { createdAt: 'DESC' },
    });
    return medicines.map((m) => this.toDto(m));
  }

  async getMedicineById(medicineId: string): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({
      where: { id: parseInt(medicineId) },
    });
    if (!medicine) throw new NotFoundException('Medicine tidak ditemukan');
    return this.toDto(medicine);
  }

  async updateMedicine(
    medicineId: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<MedicineResponseDto> {
    const medicine = await this.medicineRepository.findOne({
      where: { id: parseInt(medicineId) },
    });
    if (!medicine) throw new NotFoundException('Medicine tidak ditemukan');
    Object.assign(medicine, updateMedicineDto);
    const updated = await this.medicineRepository.save(medicine);
    return this.toDto(updated);
  }

  async deleteMedicine(medicineId: string): Promise<void> {
    await this.medicineRepository.delete(parseInt(medicineId));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.medicineRepository.delete({ userId: parseInt(userId) });
  }

  private toDto(medicine: Medicine): MedicineResponseDto {
    return {
      id: medicine.id.toString(),
      userId: medicine.userId.toString(),
      medicineName: medicine.medicineName,
      dosage: medicine.dosage,
      unit: medicine.unit,
      frequency: medicine.frequency as 'once' | 'twice' | 'thrice',
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    };
  }
}
