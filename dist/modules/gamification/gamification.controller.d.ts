import { GamificationService } from './gamification.service';
import { CreateGamificationDto } from '../../common/dtos/gamification.dto';
export declare class GamificationController {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    createGamification(createGamificationDto: CreateGamificationDto): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    getGamificationByUserAlias(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    getGamificationByUser(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    addPoints(userId: string, body: {
        points: number;
    }): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    resetStreak(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    resetGamification(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    checkMonthlyReward(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
    syncPoints(userId: string): Promise<{
        message: string;
        data: import("../../common/dtos/gamification.dto").GamificationResponseDto;
    }>;
}
