import { ScheduleService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../../common/dtos/schedules.dto';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
    createSchedule(createScheduleDto: CreateScheduleDto): Promise<{
        message: string;
        data: import("../../common/dtos/schedules.dto").ScheduleResponseDto;
    }>;
    getSchedulesByUser(userId: string): Promise<{
        data: import("../../common/dtos/schedules.dto").ScheduleResponseDto[];
    }>;
    getSchedulesByMedicine(medicineId: string): Promise<{
        data: import("../../common/dtos/schedules.dto").ScheduleResponseDto[];
    }>;
    getScheduleById(scheduleId: string): Promise<{
        data: import("../../common/dtos/schedules.dto").ScheduleResponseDto;
    }>;
    updateSchedule(scheduleId: string, updateScheduleDto: UpdateScheduleDto): Promise<{
        message: string;
        data: import("../../common/dtos/schedules.dto").ScheduleResponseDto;
    }>;
    deleteSchedule(scheduleId: string): Promise<{
        message: string;
    }>;
    getComplianceReport(userId: string, month: number, year: number): Promise<{
        data: {
            userId: string;
            month: number;
            year: number;
            totalSchedules: number;
            completedSchedules: number;
            onTimeSchedules: number;
            lateSchedules: number;
            missedSchedules: number;
            pendingSchedules: number;
            complianceRate: number;
            history: any[];
        };
    }>;
}
