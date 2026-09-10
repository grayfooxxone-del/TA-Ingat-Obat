import { User } from '../../users/entities/user.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
export declare class Schedule {
    id: number;
    userId: number;
    medicineId: number;
    medicineName: string;
    dosage: string;
    frequency: string;
    time: string;
    day: string;
    completed: boolean;
    completedAt: Date;
    notes: string;
    status: string;
    isTemplate: boolean;
    templateId: number;
    scheduledDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    user: User;
    medicine: Medicine;
}
