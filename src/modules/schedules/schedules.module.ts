import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.ctrl';
import { ScheduleService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { Evidence } from '../evidence/entities/evidence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Evidence])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class SchedulesModule {}
