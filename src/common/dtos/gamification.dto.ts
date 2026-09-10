import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateGamificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsOptional()
  points?: number;
}

export class UpdateGamificationDto {
  @IsNumber()
  @IsOptional()
  points?: number;
}

export class BadgeDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedAt?: Date;
}

export class StreakDto {
  current: number;
  longest: number;
  lastUpdated?: Date;
}

export class GamificationResponseDto {
  id: string;
  userId: string;
  points: number;
  streak: StreakDto;
  compliancePercentage: number;
  badges: BadgeDto[];
  createdAt: Date;
  updatedAt?: Date;
}
