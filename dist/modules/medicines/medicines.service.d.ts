import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto, UpdateMedicineDto, MedicineResponseDto } from '../../common/dtos/medicine.dto';
export declare class MedicineService {
    private medicineRepository;
    constructor(medicineRepository: Repository<Medicine>);
    createMedicine(createMedicineDto: CreateMedicineDto): Promise<MedicineResponseDto>;
    getMedicinesByUser(userId: string): Promise<MedicineResponseDto[]>;
    getMedicineById(medicineId: string): Promise<MedicineResponseDto>;
    updateMedicine(medicineId: string, updateMedicineDto: UpdateMedicineDto): Promise<MedicineResponseDto>;
    deleteMedicine(medicineId: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    private toDto;
}
