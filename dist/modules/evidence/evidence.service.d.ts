import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { PmoPatient } from '../pmo/entities/pmo-patient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { CreateEvidenceDto, UpdateEvidenceDto, EvidenceResponseDto } from '../../common/dtos/evidence.dto';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
export declare class EvidenceService {
    private evidenceRepository;
    private pmoPatientRepository;
    private scheduleRepository;
    private usersService;
    private firebaseService;
    constructor(evidenceRepository: Repository<Evidence>, pmoPatientRepository: Repository<PmoPatient>, scheduleRepository: Repository<Schedule>, usersService: UsersService, firebaseService: FirebaseService);
    uploadEvidence(createEvidenceDto: CreateEvidenceDto): Promise<EvidenceResponseDto>;
    getEvidenceByUser(userId: string): Promise<EvidenceResponseDto[]>;
    getEvidenceById(evidenceId: string): Promise<EvidenceResponseDto>;
    verifyEvidence(evidenceId: string, updateEvidenceDto: UpdateEvidenceDto): Promise<EvidenceResponseDto>;
    getPendingEvidenceForPatients(patientIds: number[]): Promise<EvidenceResponseDto[]>;
    getPendingEvidenceForPMO(): Promise<EvidenceResponseDto[]>;
    private toDto;
}
