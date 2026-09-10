import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { SchedulesModule } from '../schedules/schedules.module';
import { Gamification } from './entities/gamification.entity';
import { PmoPatient } from '../pmo/entities/pmo-patient.entity';
import { Evidence } from '../evidence/entities/evidence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gamification, PmoPatient, Evidence]),
    SchedulesModule,
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
