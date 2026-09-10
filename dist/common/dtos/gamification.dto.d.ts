export declare class CreateGamificationDto {
    userId: string;
    points?: number;
}
export declare class UpdateGamificationDto {
    points?: number;
}
export declare class BadgeDto {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    achievedAt?: Date;
}
export declare class StreakDto {
    current: number;
    longest: number;
    lastUpdated?: Date;
}
export declare class GamificationResponseDto {
    id: string;
    userId: string;
    points: number;
    streak: StreakDto;
    compliancePercentage: number;
    badges: BadgeDto[];
    createdAt: Date;
    updatedAt?: Date;
}
