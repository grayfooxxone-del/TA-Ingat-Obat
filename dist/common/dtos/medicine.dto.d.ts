export declare class CreateMedicineDto {
    userId: string;
    medicineName: string;
    dosage?: string;
    unit?: string;
    frequency?: string;
}
export declare class UpdateMedicineDto {
    medicineName?: string;
    dosage?: string;
    unit?: string;
    frequency?: string;
}
export declare class MedicineResponseDto {
    id: string;
    userId: string;
    medicineName: string;
    dosage: string;
    unit: string;
    frequency: 'once' | 'twice' | 'thrice';
    createdAt: Date;
    updatedAt?: Date;
}
