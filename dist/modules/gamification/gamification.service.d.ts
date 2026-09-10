import { Repository } from 'typeorm';
import { CreateGamificationDto, GamificationResponseDto } from '../../common/dtos/gamification.dto';
import { ScheduleService } from '../schedules/schedules.service';
import { Gamification } from './entities/gamification.entity';
import { PmoPatient } from '../pmo/entities/pmo-patient.entity';
import { Evidence } from '../evidence/entities/evidence.entity';
export declare class GamificationService {
    private gamificationRepository;
    private pmoPatientRepository;
    private evidenceRepository;
    private scheduleService;
    private readonly POINTS_PER_DAY;
    private readonly MAX_POINTS;
    private readonly BADGE_THRESHOLDS;
    constructor(gamificationRepository: Repository<Gamification>, pmoPatientRepository: Repository<PmoPatient>, evidenceRepository: Repository<Evidence>, scheduleService: ScheduleService);
    createGamification(createGamificationDto: CreateGamificationDto): Promise<GamificationResponseDto>;
    getGamificationByUser(userId: string): Promise<GamificationResponseDto>;
    addPoints(userId: string, pointsToAdd: number, actionDate?: Date): Promise<GamificationResponseDto>;
    syncPoints(userId: string): Promise<GamificationResponseDto>;
    resetStreak(userId: string): Promise<GamificationResponseDto>;
    resetGamification(userId: string): Promise<GamificationResponseDto>;
    checkMonthlyReward(userId: string): Promise<GamificationResponseDto>;
    private toResponseDto;
    private generateBadgesForPoints;
    deleteByUserId(userId: string): Promise<void>;
}
