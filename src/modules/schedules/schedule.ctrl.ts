import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
} from '../../common/dtos/schedules.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    const schedule =
      await this.scheduleService.createSchedule(createScheduleDto);
    return {
      message: 'Schedule created successfully',
      data: schedule,
    };
  }

  @Get('user/:userId')
  async getSchedulesByUser(@Param('userId') userId: string) {
    const schedules = await this.scheduleService.getSchedulesByUser(userId);
    return {
      data: schedules,
    };
  }

  @Get('medicine/:medicineId')
  async getSchedulesByMedicine(@Param('medicineId') medicineId: string) {
    const schedules =
      await this.scheduleService.getSchedulesByMedicine(medicineId);
    return {
      data: schedules,
    };
  }

  @Get(':id')
  async getScheduleById(@Param('id') scheduleId: string) {
    const schedule = await this.scheduleService.getScheduleById(scheduleId);
    return {
      data: schedule,
    };
  }

  @Put(':id')
  async updateSchedule(
    @Param('id') scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.scheduleService.updateSchedule(
      scheduleId,
      updateScheduleDto,
    );
    return {
      message: 'Schedule updated successfully',
      data: schedule,
    };
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') scheduleId: string) {
    await this.scheduleService.deleteSchedule(scheduleId);
    return {
      message: 'Schedule deleted successfully',
    };
  }

  @Get('compliance/:userId')
  async getComplianceReport(
    @Param('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    const report = await this.scheduleService.getComplianceReport(
      userId,
      month,
      year,
    );
    return {
      data: report,
    };
  }
}
