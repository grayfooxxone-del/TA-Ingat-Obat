import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { CreateGamificationDto } from '../../common/dtos/gamification.dto';

@Controller('gamification')
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Post()
  async createGamification(
    @Body() createGamificationDto: CreateGamificationDto,
  ) {
    const gamification = await this.gamificationService.createGamification(
      createGamificationDto,
    );
    return {
      message: 'Gamification created successfully',
      data: gamification,
    };
  }

  @Get('user/:userId')
  async getGamificationByUserAlias(@Param('userId') userId: string) {
    const gamification =
      await this.gamificationService.getGamificationByUser(userId);
    return {
      message: 'Gamification data retrieved successfully',
      data: gamification,
    };
  }

  @Get(':userId')
  async getGamificationByUser(@Param('userId') userId: string) {
    const gamification =
      await this.gamificationService.getGamificationByUser(userId);
    return {
      message: 'Gamification data retrieved successfully',
      data: gamification,
    };
  }

  @Put(':userId/add-points')
  async addPoints(
    @Param('userId') userId: string,
    @Body() body: { points: number },
  ) {
    const gamification = await this.gamificationService.addPoints(
      userId,
      body.points,
    );
    return {
      message: 'Points added successfully',
      data: gamification,
    };
  }

  @Put(':userId/reset-streak')
  async resetStreak(@Param('userId') userId: string) {
    const gamification = await this.gamificationService.resetStreak(userId);
    return {
      message: 'Streak reset successfully',
      data: gamification,
    };
  }

  @Put(':userId/reset')
  async resetGamification(@Param('userId') userId: string) {
    const gamification =
      await this.gamificationService.resetGamification(userId);
    return {
      message: 'Gamification reset successfully',
      data: gamification,
    };
  }

  @Post(':userId/check-monthly-reward')
  async checkMonthlyReward(@Param('userId') userId: string) {
    const gamification =
      await this.gamificationService.checkMonthlyReward(userId);
    return {
      message: 'Monthly reward checked',
      data: gamification,
    };
  }

  @Post(':userId/sync')
  async syncPoints(@Param('userId') userId: string) {
    const gamification = await this.gamificationService.syncPoints(userId);
    return {
      message: 'Points synced from verified evidence',
      data: gamification,
    };
  }
}
