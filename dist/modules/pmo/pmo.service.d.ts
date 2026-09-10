import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PmoPatient } from './entities/pmo-patient.entity';
import { PairPatientDto, MonitorPatientResponseDto, PMOVerificationDto } from '../../common/dtos/pmo.dto';
import { UsersService } from '../users/users.service';
import { EvidenceService } from '../evidence/evidence.service';
import { GamificationService } from '../gamification/gamification.service';
import { ScheduleService } from '../schedules/schedules.service';
import { FirebaseService } from '../firebase/firebase.service';
export declare class PMOService implements OnModuleInit, OnModuleDestroy {
    private pmoPatientRepository;
    private readonly usersService;
    private readonly evidenceService;
    private readonly gamificationService;
    private readonly scheduleService;
    private readonly firebaseService;
    private missedCheckInterval;
    private notifiedMissedSchedules;
    constructor(pmoPatientRepository: Repository<PmoPatient>, usersService: UsersService, evidenceService: EvidenceService, gamificationService: GamificationService, scheduleService: ScheduleService, firebaseService: FirebaseService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    checkMissedSchedules(): Promise<void>;
    pairPatient(pmoId: string, pairPatientDto: PairPatientDto): Promise<{
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
    getMonitoredPatients(pmoId: string): Promise<MonitorPatientResponseDto[]>;
    getConnectedPMOs(patientId: string): Promise<{
        id: string;
        name: string;
        hospital: string;
        connectedDate: string;
        status: string;
        phone: string;
        address: string;
    }[]>;
    getPendingEvidence(pmoId: string): Promise<import("../../common/dtos/evidence.dto").EvidenceResponseDto[]>;
    getDashboardData(pmoId: string): Promise<{
        totalPasien: number;
        perluVerifikasi: number;
        belumLapor: number;
        patients: any[];
    }>;
    unpairPatient(pairingId: string): Promise<void>;
    unpairPatientByPmoAndPatient(pmoId: string, patientId: string): Promise<void>;
    verifyEvidence(pmoId: string, verificationDto: PMOVerificationDto): Promise<{
        message: string;
        data: {
            evidenceId: string;
            approved: boolean;
            reason: string;
            verifiedAt: Date;
        };
    }>;
    deleteByUserId(userId: string): Promise<void>;
    remindPatient(pmoId: string, patientId: string): Promise<void>;
}
