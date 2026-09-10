import { PMOService } from './pmo.service';
import { PairPatientDto, PMOVerificationDto } from '../../common/dtos/pmo.dto';
export declare class PMOController {
    private pmoService;
    constructor(pmoService: PMOService);
    pairPatient(body: {
        pmoId: string;
        pairPatientDto: PairPatientDto;
    }): Promise<{
        message: string;
        data: {
            patientName: string;
            patientCode: string;
            id: number;
            pmoId: number;
            patientId: number;
            status: string;
            pairedAt: Date;
            pmo: import("../users/entities/user.entity").User;
            patient: import("../users/entities/user.entity").User;
        };
    }>;
    getMonitoredPatients(pmoId: string): Promise<{
        data: import("../../common/dtos/pmo.dto").MonitorPatientResponseDto[];
    }>;
    getConnectedPMOs(patientId: string): Promise<{
        data: {
            id: string;
            name: string;
            hospital: string;
            connectedDate: string;
            status: string;
            phone: string;
            address: string;
        }[];
    }>;
    getDashboardData(pmoId: string): Promise<{
        data: {
            totalPasien: number;
            perluVerifikasi: number;
            belumLapor: number;
            patients: any[];
        };
    }>;
    getPendingEvidence(pmoId: string): Promise<{
        data: import("../../common/dtos/evidence.dto").EvidenceResponseDto[];
    }>;
    unpairPatient(pairingId: string): Promise<{
        message: string;
    }>;
    unpairPatientByPmoAndPatient(pmoId: string, patientId: string): Promise<{
        message: string;
    }>;
    verifyEvidence(body: {
        pmoId: string;
        verificationDto: PMOVerificationDto;
    }): Promise<{
        message: string;
        data: {
            evidenceId: string;
            approved: boolean;
            reason: string;
            verifiedAt: Date;
        };
    }>;
    remindPatient(body: {
        pmoId: string;
        patientId: string;
    }): Promise<{
        message: string;
    }>;
}
