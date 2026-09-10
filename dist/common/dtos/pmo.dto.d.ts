export declare class PairPatientDto {
    patientCode: string;
}
export declare class MonitorPatientResponseDto {
    id: string;
    name: string;
    pairedDate: Date;
    status: 'active' | 'inactive';
    lastUpdate: Date;
    compliance: number;
    phone?: string;
    address?: string;
}
export declare class PMOVerificationDto {
    evidenceId: string;
    approved: boolean;
    reason?: string;
}
