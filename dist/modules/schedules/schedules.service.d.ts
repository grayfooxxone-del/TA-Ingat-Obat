import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Evidence } from '../evidence/entities/evidence.entity';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto } from '../../common/dtos/schedules.dto';
export declare class ScheduleService {
    private scheduleRepository;
    private evidenceRepository;
    constructor(scheduleRepository: Repository<Schedule>, evidenceRepository: Repository<Evidence>);
    createSchedule(createScheduleDto: CreateScheduleDto): Promise<ScheduleResponseDto>;
    getSchedulesByUser(userId: string): Promise<ScheduleResponseDto[]>;
    getSchedulesByMedicine(medicineId: string): Promise<ScheduleResponseDto[]>;
    getScheduleById(scheduleId: string): Promise<ScheduleResponseDto>;
    updateSchedule(scheduleId: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleResponseDto>;
    deleteSchedule(scheduleId: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    resetUserSchedulesAndEvidence(userId: string): Promise<void>;
    getComplianceReport(userId: string, month: number, year: number): Promise<{
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
    }>;
    private toDto;
}
