import { User } from '../../users/entities/user.entity';
export declare class PmoPatient {
    id: number;
    pmoId: number;
    patientId: number;
    status: string;
    pairedAt: Date;
    pmo: User;
    patient: User;
}
