import { Evidence } from '../../evidence/entities/evidence.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    patientCode?: string;
    iotDeviceId?: string;
    iotStatus?: string;
    boxStatus?: string;
    batteryLevel?: number;
    lastOpenedAt?: Date;
    lastIotUpdateAt?: Date;
    deviceToken?: string;
    createdAt: Date;
    evidences: Evidence[];
}
