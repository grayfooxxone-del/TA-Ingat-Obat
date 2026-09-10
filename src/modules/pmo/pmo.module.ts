import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PMOController } from './pmo.controller';
import { PMOService } from './pmo.service';
import { UsersModule } from '../users/users.module';
import { PmoPatient } from './entities/pmo-patient.entity';
import { EvidenceModule } from '../evidence/evidence.module';
import { GamificationModule } from '../gamification/gamification.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PmoPatient]),
    UsersModule,
    EvidenceModule,
    GamificationModule,
    SchedulesModule,
  ],
  controllers: [PMOController],
  providers: [PMOService],
  exports: [PMOService],
})
export class PMOModule {}
