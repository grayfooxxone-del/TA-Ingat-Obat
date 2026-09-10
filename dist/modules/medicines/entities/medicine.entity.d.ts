import { User } from '../../users/entities/user.entity';
export declare class Medicine {
    id: number;
    userId: number;
    medicineName: string;
    dosage: string;
    unit: string;
    frequency: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
