import { MedicineService } from './medicines.service';
import { CreateMedicineDto, UpdateMedicineDto } from '../../common/dtos/medicine.dto';
export declare class MedicineController {
    private medicineService;
    constructor(medicineService: MedicineService);
    createMedicine(createMedicineDto: CreateMedicineDto): Promise<{
        message: string;
        data: import("../../common/dtos/medicine.dto").MedicineResponseDto;
    }>;
    getMedicinesByUser(userId: string): Promise<{
        data: import("../../common/dtos/medicine.dto").MedicineResponseDto[];
    }>;
    getMedicineById(medicineId: string): Promise<{
        data: import("../../common/dtos/medicine.dto").MedicineResponseDto;
    }>;
    updateMedicine(medicineId: string, updateMedicineDto: UpdateMedicineDto): Promise<{
        message: string;
        data: import("../../common/dtos/medicine.dto").MedicineResponseDto;
    }>;
    deleteMedicine(medicineId: string): Promise<{
        message: string;
    }>;
}
