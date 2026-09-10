import { User } from '../../users/entities/user.entity';
export declare class Evidence {
    id: number;
    userId: number;
    scheduleId: number;
    photoUrl: string;
    fileUrl: string;
    type: string;
    note: string;
    status: string;
    verified: boolean;
    verifiedBy: string;
    verifiedAt: Date;
    createdAt: Date;
    user: User;
}
