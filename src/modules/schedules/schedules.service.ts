import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Evidence } from '../evidence/entities/evidence.entity';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponseDto,
} from '../../common/dtos/schedules.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
  ) {}

  async createSchedule(
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    const schedule = this.scheduleRepository.create({
      userId: parseInt(createScheduleDto.userId),
      medicineId: createScheduleDto.medicineId
        ? parseInt(createScheduleDto.medicineId)
        : null,
      medicineName: createScheduleDto.medicineName,
      dosage: createScheduleDto.dosage,
      frequency: createScheduleDto.frequency,
      time: createScheduleDto.time,
      day: createScheduleDto.day,
      notes: createScheduleDto.notes,
      completed: false,
    });
    const saved = await this.scheduleRepository.save(schedule);
    return this.toDto(saved);
  }

  async getSchedulesByUser(userId: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { userId: parseInt(userId) },
      order: { createdAt: 'DESC' },
    });

    if (schedules.length === 0) return [];

    const evidences = await this.evidenceRepository.find({
      where: schedules.map((s) => ({ scheduleId: s.id })),
    });

    // Get today's date in WIB
    const nowUtc = new Date();
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const nowWib = new Date(nowUtc.getTime() + wibOffsetMs);
    const todayStr = nowWib.toISOString().split('T')[0];

    for (const s of schedules) {
      // Find evidence for this schedule uploaded TODAY (in WIB)
      const evToday = evidences.find((e) => {
        if (e.scheduleId !== s.id) return false;
        const evDateUtc = new Date(e.createdAt);
        const evDateWib = new Date(evDateUtc.getTime() + wibOffsetMs);
        return evDateWib.toISOString().split('T')[0] === todayStr;
      });

      if (evToday) {
        s.completed = true;

        const schedTime = s.time;
        // Construct the exact target time for TODAY in WIB
        const schedDateWibStr = `${todayStr}T${schedTime}:00+07:00`;
        const schedDateExact = new Date(schedDateWibStr);

        const uploadDate = new Date(evToday.createdAt);
        const diffMins = (uploadDate.getTime() - schedDateExact.getTime()) / 60000;

        if (diffMins <= 30 && diffMins >= -60) {
          s.status = 'Tepat Waktu';
        } else {
          s.status = 'Terlambat';
        }
      } else {
        s.completed = false;
        s.status = 'Menunggu';
      }
    }

    return schedules.map((s) => this.toDto(s));
  }

  async getSchedulesByMedicine(
    medicineId: string,
  ): Promise<ScheduleResponseDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { medicineId: parseInt(medicineId) },
    });
    return schedules.map((s) => this.toDto(s));
  }

  async getScheduleById(scheduleId: string): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: parseInt(scheduleId) },
    });
    if (!schedule) throw new NotFoundException('Jadwal tidak ditemukan');
    return this.toDto(schedule);
  }

  async updateSchedule(
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: parseInt(scheduleId) },
    });
    if (!schedule) throw new NotFoundException('Jadwal tidak ditemukan');

    if (updateScheduleDto.medicineId !== undefined) {
      schedule.medicineId = updateScheduleDto.medicineId
        ? parseInt(updateScheduleDto.medicineId)
        : null;
    }

    const wasCompleted =
      updateScheduleDto.completed === true && !schedule.completed;

    if (updateScheduleDto.time !== undefined) schedule.time = updateScheduleDto.time;
    if (updateScheduleDto.day !== undefined) schedule.day = updateScheduleDto.day;
    if (updateScheduleDto.medicineName !== undefined) schedule.medicineName = updateScheduleDto.medicineName;
    if (updateScheduleDto.dosage !== undefined) schedule.dosage = updateScheduleDto.dosage;
    if (updateScheduleDto.frequency !== undefined) schedule.frequency = updateScheduleDto.frequency;
    if (updateScheduleDto.status !== undefined) schedule.status = updateScheduleDto.status;

    if (wasCompleted) {
      schedule.completed = true;
      schedule.completedAt = new Date();
    }

    const updated = await this.scheduleRepository.save(schedule);
    return this.toDto(updated);
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.scheduleRepository.softDelete(parseInt(scheduleId));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.scheduleRepository.delete({ userId: parseInt(userId) });
  }

  async resetUserSchedulesAndEvidence(userId: string): Promise<void> {
    const userIdNum = parseInt(userId);
    await this.evidenceRepository.delete({ userId: userIdNum });

    const schedules = await this.scheduleRepository.find({
      where: { userId: userIdNum },
    });

    for (const schedule of schedules) {
      schedule.completed = false;
      schedule.completedAt = null;
      schedule.status = 'Menunggu';
      await this.scheduleRepository.save(schedule);
    }
  }

  async getComplianceReport(userId: string, month: number, year: number) {
    const allSchedules = await this.scheduleRepository.find({
      where: { userId: parseInt(userId) },
      order: { createdAt: 'ASC', time: 'ASC' },
      withDeleted: true,
    });

    const evidences = await this.evidenceRepository.find({
      where: { userId: parseInt(userId) },
      order: { createdAt: 'ASC' },
    });

    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const nowWib = new Date(new Date().getTime() + wibOffsetMs);
    const todayStr = nowWib.toISOString().split('T')[0];

    // Group evidence by scheduleId and date
    const evMap = new Map<string, Evidence>();
    for (const ev of evidences) {
      const evDateWib = new Date(new Date(ev.createdAt).getTime() + wibOffsetMs);
      const evDateStr = evDateWib.toISOString().split('T')[0];
      const key = `${ev.scheduleId}-${evDateStr}`;
      if (!evMap.has(key)) {
        evMap.set(key, ev);
      }
    }

    // Determine the start date (earliest schedule creation)
    let startDateStr = todayStr;
    if (allSchedules.length > 0) {
      const firstCreated = new Date(new Date(allSchedules[0].createdAt).getTime() + wibOffsetMs);
      startDateStr = firstCreated.toISOString().split('T')[0];
    }

    // Determine the end date (last day of requested month, or today if requested month is current month)
    const targetMonthEnd = new Date(year, month, 0); // Last day of month
    let endDateStr = targetMonthEnd.toISOString().split('T')[0];
    
    // If requested month is in the future or current month, cap at today
    if (year > nowWib.getFullYear() || (year === nowWib.getFullYear() && month >= nowWib.getMonth() + 1)) {
        endDateStr = todayStr;
    }

    // Generate all dates from startDate to endDate
    const allDates: string[] = [];
    let currDate = new Date(startDateStr);
    const endDateObj = new Date(endDateStr);
    while (currDate <= endDateObj) {
      allDates.push(currDate.toISOString().split('T')[0]);
      currDate.setDate(currDate.getDate() + 1);
    }

    const fullHistory: any[] = [];
    let currentStreak = 0;

    for (const dateStr of allDates) {
      // Find schedules active on this date
      const activeSchedulesForDay = allSchedules.filter(s => {
        const createdDateWib = new Date(new Date(s.createdAt).getTime() + wibOffsetMs);
        const createdDateStr = createdDateWib.toISOString().split('T')[0];
        if (dateStr < createdDateStr) return false;

        if (s.deletedAt) {
          const deletedDateWib = new Date(new Date(s.deletedAt).getTime() + wibOffsetMs);
          const deletedDateStr = deletedDateWib.toISOString().split('T')[0];
          if (dateStr > deletedDateStr) return false;
        }
        return true;
      });

      // If no schedules were active on this day, skip streak logic
      if (activeSchedulesForDay.length === 0) continue;

      let allCompletedOnTimeOrLate = true;
      const dayEntries: any[] = [];

      for (const s of activeSchedulesForDay) {
        const ev = evMap.get(`${s.id}-${dateStr}`);
        let status = 'Menunggu';
        let uploadedAt = '-';
        let isCompleted = false;

        if (ev) {
          const schedDateWibStr = `${dateStr}T${s.time}:00+07:00`;
          const schedDateExact = new Date(schedDateWibStr);
          const uploadDate = new Date(ev.createdAt);
          const diffMins = (uploadDate.getTime() - schedDateExact.getTime()) / 60000;
          status = diffMins <= 30 && diffMins >= -60 ? 'Tepat Waktu' : 'Terlambat';
          uploadedAt = new Date(ev.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
          isCompleted = true;
        } else {
          const dateObj = new Date(dateStr);
          const nowDateObj = new Date(todayStr);
          if (dateObj < nowDateObj) {
            status = 'Terlewat';
          } else {
            status = 'Menunggu';
          }
          if (status === 'Terlewat') {
            allCompletedOnTimeOrLate = false;
          }
        }

        dayEntries.push({
          dateStr,
          date: new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: s.time,
          medicine: s.medicineName || 'Obat',
          status,
          uploadedAt,
          scheduleId: s.id,
        });
      }

      // If today is Menunggu, we shouldn't reset streak yet, just don't increment it.
      const hasMenunggu = dayEntries.some(e => e.status === 'Menunggu');
      const hasTerlewat = dayEntries.some(e => e.status === 'Terlewat');

      if (hasTerlewat) {
        currentStreak = 0; // Reset streak if any schedule was missed
      } else if (!hasMenunggu && dayEntries.length > 0) {
        currentStreak += 1; // Increment if all completed
      }

      // Add day entries to full history with current streak
      for (const entry of dayEntries) {
        entry.streakCount = currentStreak;
        fullHistory.push(entry);
      }
    }

    // Filter fullHistory to only include the requested month
    const requestedMonthStr = `${year}-${month.toString().padStart(2, '0')}`;
    const history = fullHistory.filter(h => h.dateStr.startsWith(requestedMonthStr));

    const total = history.length;
    let onTime = 0, late = 0, missed = 0, pending = 0;

    history.forEach((h) => {
      if (h.status === 'Tepat Waktu') onTime++;
      else if (h.status === 'Terlambat') late++;
      else if (h.status === 'Terlewat') missed++;
      else pending++;
    });

    const completed = onTime + late;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      userId,
      month,
      year,
      totalSchedules: total,
      completedSchedules: completed,
      onTimeSchedules: onTime,
      lateSchedules: late,
      missedSchedules: missed,
      pendingSchedules: pending,
      complianceRate: rate,
      history,
    };
  }

  private toDto(schedule: Schedule): ScheduleResponseDto {
    return {
      id: schedule.id.toString(),
      medicineId: schedule.medicineId?.toString(),
      userId: schedule.userId.toString(),
      medicineName: schedule.medicineName,
      dosage: schedule.dosage,
      frequency: schedule.frequency,
      time: schedule.time,
      day: schedule.day,
      notes: schedule.notes,
      completed: schedule.completed,
      completedAt: schedule.completedAt,
      status: schedule.status,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}
