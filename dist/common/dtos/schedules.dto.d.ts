export declare class CreateScheduleDto {
    medicineId?: string;
    userId: string;
    time: string;
    day: string;
    medicineName?: string;
    dosage?: string;
    frequency?: string;
    notes?: string;
}
export declare class UpdateScheduleDto {
    time?: string;
    day?: string;
    completed?: boolean;
    medicineId?: string;
    medicineName?: string;
    dosage?: string;
    frequency?: string;
    status?: string;
}
export declare class ScheduleResponseDto {
    id: string;
    medicineId: string;
    userId: string;
    time: string;
    day: string;
    medicineName?: string;
    dosage?: string;
    frequency?: string;
    notes?: string;
    completed: boolean;
    completedAt?: Date;
    status?: string;
    isTemplate?: boolean;
    templateId?: number;
    scheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
