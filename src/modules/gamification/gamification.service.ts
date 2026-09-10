import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateGamificationDto,
  GamificationResponseDto,
  BadgeDto,
} from '../../common/dtos/gamification.dto';
import { ScheduleService } from '../schedules/schedules.service';
import { Gamification } from './entities/gamification.entity';
import { PmoPatient } from '../pmo/entities/pmo-patient.entity';
import { Evidence } from '../evidence/entities/evidence.entity';

@Injectable()
export class GamificationService {
  // Constants untuk perhitungan
  private readonly POINTS_PER_DAY = 10;
  private readonly MAX_POINTS = 1680; // 168 hari × 10 poin
  private readonly BADGE_THRESHOLDS = [
    { name: 'Langkah Awal', icon: '🥉', points: 0 },
    { name: 'Pejuang Bulan Pertama', icon: '🥉', points: 280 },
    { name: 'Lulus Fase Intensif', icon: '🥈', points: 560 },
    { name: 'Setengah Jalan', icon: '🥇', points: 840 },
    { name: 'Pejuang Konsisten', icon: '💎', points: 1120 },
    { name: 'Hampir Selesai', icon: '💎', points: 1400 },
    { name: 'Pahlawan Sehat', icon: '👑', points: 1680 },
  ];

  constructor(
    @InjectRepository(Gamification)
    private gamificationRepository: Repository<Gamification>,
    @InjectRepository(PmoPatient)
    private pmoPatientRepository: Repository<PmoPatient>,
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private scheduleService: ScheduleService,
  ) {}

  async createGamification(
    createGamificationDto: CreateGamificationDto,
  ): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(createGamificationDto.userId, 10);

    // Cek apakah data sudah ada
    let gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (!gamification) {
      gamification = this.gamificationRepository.create({
        userId: userIdNum,
        points: createGamificationDto.points || 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakUpdate: new Date(),
      });
      gamification = await this.gamificationRepository.save(gamification);
    }

    return this.toResponseDto(gamification);
  }

  async getGamificationByUser(
    userId: string,
  ): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);

    // Cek apakah pasien memiliki hubungan aktif dengan PMO
    const pairing = await this.pmoPatientRepository.findOne({
      where: { patientId: userIdNum, status: 'active' },
    });

    if (!pairing) {
      // Jika tidak terhubung aktif, kembalikan data kosong/nol
      return {
        id: 'unpaired',
        userId,
        points: 0,
        streak: {
          current: 0,
          longest: 0,
          lastUpdated: new Date(),
        },
        compliancePercentage: 0,
        badges: this.generateBadgesForPoints(0),
        createdAt: new Date(),
      };
    }

    // Auto-sinkronisasi poin dari bukti terverifikasi (berjalan di belakang layar)
    await this.syncPoints(userId);

    const gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (!gamification) {
      return await this.createGamification({ userId, points: 0 });
    }

    const today = new Date();
    const lastUpdate = gamification.lastStreakUpdate || today;
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const lastUpdateDate = new Date(
      lastUpdate.getFullYear(),
      lastUpdate.getMonth(),
      lastUpdate.getDate(),
    );
    const diffTime = Math.abs(todayDate.getTime() - lastUpdateDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let currentStreakToDisplay = gamification.currentStreak;
    if (diffDays > 1) {
      // Sudah lewat lebih dari 1 hari tanpa upload = streak putus
      currentStreakToDisplay = 0;
    }

    const response = this.toResponseDto(gamification);
    response.streak.current = currentStreakToDisplay;
    return response;
  }

  async addPoints(
    userId: string,
    pointsToAdd: number,
    actionDate: Date = new Date(),
  ): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);
    let gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (!gamification) {
      gamification = this.gamificationRepository.create({
        userId: userIdNum,
        points: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakUpdate: new Date(0), // Set ke masa lalu agar diffDays aman
      });
    }

    const today = actionDate;
    const lastUpdate = gamification.lastStreakUpdate || new Date(0);
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const lastUpdateDate = new Date(
      lastUpdate.getFullYear(),
      lastUpdate.getMonth(),
      lastUpdate.getDate(),
    );
    const diffTime = todayDate.getTime() - lastUpdateDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Jika sudah pernah dapat poin untuk hari (actionDate) ini, abaikan!
    if (diffDays === 0 && gamification.points > 0) {
      return this.toResponseDto(gamification);
    }

    gamification.points = Math.min(
      gamification.points + pointsToAdd,
      this.MAX_POINTS,
    );

    if (diffDays === 1) {
      // Upload hari berikutnya berurutan → tambah streak
      gamification.currentStreak += 1;
    } else if (diffDays > 1) {
      // Terlewat 1 hari atau lebih → reset ke 0, mulai dari 1
      gamification.currentStreak = 1;
    } else if (diffDays < 0) {
      // actionDate di masa lalu dibandingkan lastUpdate, biarkan streak seperti semula
    } else if (diffDays === 0 && gamification.points === pointsToAdd) {
      // User baru pertama kali dapat poin
      gamification.currentStreak = 1;
    }

    // Selalu update lastStreakUpdate jika actionDate lebih baru
    if (diffDays >= 0) {
      gamification.lastStreakUpdate = actionDate;
    }

    if (gamification.currentStreak > gamification.longestStreak) {
      gamification.longestStreak = gamification.currentStreak;
    }

    const saved = await this.gamificationRepository.save(gamification);
    return this.toResponseDto(saved);
  }

  // Sinkronisasi poin dari bukti yang sudah terverifikasi (TIDAK pernah reset ke 0)
  async syncPoints(userId: string): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);
    const wibOffsetMs = 7 * 60 * 60 * 1000;

    // Ambil semua jadwal milik pasien
    const schedules = await this.scheduleService.getSchedulesByUser(userId);
    if (schedules.length === 0) {
      const g = await this.gamificationRepository.findOne({
        where: { userId: userIdNum },
      });
      return g
        ? this.toResponseDto(g)
        : await this.createGamification({ userId, points: 0 });
    }

    // Ambil semua bukti yang sudah diverifikasi milik pasien
    const verifiedEvidences = await this.evidenceRepository.find({
      where: { userId: userIdNum, verified: true },
      order: { createdAt: 'ASC' },
    });

    // Kelompokkan bukti terverifikasi per hari
    const dayMap = new Map<string, Evidence[]>();
    for (const ev of verifiedEvidences) {
      const evWib = new Date(new Date(ev.createdAt).getTime() + wibOffsetMs);
      const dayStr = evWib.toISOString().split('T')[0];
      if (!dayMap.has(dayStr)) dayMap.set(dayStr, []);
      dayMap.get(dayStr).push(ev);
    }

    // Ambil data gamification saat ini
    let gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (!gamification) {
      gamification = this.gamificationRepository.create({
        userId: userIdNum,
        points: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakUpdate: new Date(0),
      });
      gamification = await this.gamificationRepository.save(gamification);
    }

    // Tanggal terakhir poin diberikan (dalam WIB)
    const lastRewardWib = new Date(
      new Date(gamification.lastStreakUpdate || new Date(0)).getTime() +
        wibOffsetMs,
    );
    const lastRewardStr = lastRewardWib.toISOString().split('T')[0];

    // Cari hari-hari yang BELUM dapat poin dan semua jadwalnya sudah terverifikasi
    const rewardDays: string[] = [];
    for (const [dayStr, dayEvidences] of dayMap.entries()) {
      // Lewati hari yang sudah dapat poin
      if (dayStr <= lastRewardStr && gamification.points > 0) continue;

      let allDone = true;
      for (const sched of schedules) {
        const found = dayEvidences.find(
          (e) =>
            String(e.scheduleId) === String(sched.templateId) ||
            String(e.scheduleId) === String(sched.id),
        );
        if (!found) {
          allDone = false;
          break;
        }
      }
      if (allDone) rewardDays.push(dayStr);
    }

    if (rewardDays.length === 0) {
      return this.toResponseDto(gamification);
    }

    // Tambahkan poin per hari (TANPA reset)
    const sortedDays = rewardDays.sort();
    let result: GamificationResponseDto = this.toResponseDto(gamification);
    for (const dayStr of sortedDays) {
      result = await this.addPoints(
        userId,
        10,
        new Date(`${dayStr}T12:00:00+07:00`),
      );
    }
    return result;
  }

  async resetStreak(userId: string): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);
    const gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (gamification) {
      gamification.currentStreak = 0;
      gamification.lastStreakUpdate = new Date();
      const saved = await this.gamificationRepository.save(gamification);
      return this.toResponseDto(saved);
    }
    return await this.getGamificationByUser(userId);
  }

  async resetGamification(userId: string): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);
    // Reset schedules and delete all uploaded evidence photos
    await this.scheduleService.resetUserSchedulesAndEvidence(userId);

    const gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (gamification) {
      gamification.points = 0;
      gamification.currentStreak = 0;
      gamification.longestStreak = 0;
      gamification.lastStreakUpdate = new Date();
      const saved = await this.gamificationRepository.save(gamification);
      return this.toResponseDto(saved);
    }
    return await this.getGamificationByUser(userId);
  }

  async checkMonthlyReward(userId: string): Promise<GamificationResponseDto> {
    const userIdNum = parseInt(userId, 10);
    const gamification = await this.gamificationRepository.findOne({
      where: { userId: userIdNum },
    });
    if (!gamification) {
      return await this.getGamificationByUser(userId);
    }

    return this.toResponseDto(gamification);
  }

  private toResponseDto(entity: Gamification): GamificationResponseDto {
    const points = entity.points;
    const compliancePercentage = Math.min(
      (points / this.MAX_POINTS) * 100,
      100,
    );
    const badges = this.generateBadgesForPoints(points);

    return {
      id: entity.id.toString(),
      userId: entity.userId.toString(),
      points: entity.points,
      streak: {
        current: entity.currentStreak,
        longest: entity.longestStreak,
        lastUpdated: entity.lastStreakUpdate,
      },
      compliancePercentage,
      badges,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Generate badges berdasarkan jumlah poin secara dinamis
   */
  private generateBadgesForPoints(points: number): BadgeDto[] {
    const badges: BadgeDto[] = [];
    for (const threshold of this.BADGE_THRESHOLDS) {
      if (points >= threshold.points) {
        badges.push({
          id: `badge-${threshold.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: threshold.name,
          description: `Mencapai ${threshold.points} poin`,
          icon: threshold.icon,
          achieved: true,
          achievedAt: new Date(),
        });
      }
    }
    return badges;
  }

  async deleteByUserId(userId: string): Promise<void> {
    const userIdNum = parseInt(userId, 10);
    await this.gamificationRepository.delete({ userId: userIdNum });
  }
}
