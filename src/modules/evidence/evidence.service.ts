import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { PmoPatient } from '../pmo/entities/pmo-patient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import {
  CreateEvidenceDto,
  UpdateEvidenceDto,
  EvidenceResponseDto,
} from '../../common/dtos/evidence.dto';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    @InjectRepository(PmoPatient)
    private pmoPatientRepository: Repository<PmoPatient>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private usersService: UsersService,
    private firebaseService: FirebaseService,
  ) {}

  async uploadEvidence(
    createEvidenceDto: CreateEvidenceDto,
  ): Promise<EvidenceResponseDto> {
    const evidence = this.evidenceRepository.create({
      userId: parseInt(createEvidenceDto.userId),
      scheduleId: createEvidenceDto.scheduleId
        ? parseInt(createEvidenceDto.scheduleId)
        : null,
      type: createEvidenceDto.type,
      fileUrl: createEvidenceDto.fileUrl,
      photoUrl: createEvidenceDto.fileUrl,
      note: createEvidenceDto.note,
      verified: false,
      status: 'pending',
    });
    const saved = await this.evidenceRepository.save(evidence);

    // KELOLA NOTIFIKASI PUSH KE PMO SECARA ASYNC
    try {
      const patient = await this.usersService.getUserById(createEvidenceDto.userId);
      if (patient) {
        let isLate = false;
        let diffMins = 0;
        let timeString = '';

        if (createEvidenceDto.scheduleId) {
          const schedule = await this.scheduleRepository.findOne({
            where: { id: parseInt(createEvidenceDto.scheduleId) },
          });
          if (schedule) {
            timeString = schedule.time;
            const [h, m] = timeString.split(':').map(Number);
            const now = new Date();
            const schedDate = new Date(schedule.createdAt);
            // Konversi jam WIB ke UTC dengan metode yang aman untuk semua jam (termasuk < 07.00 WIB)
            const wibOffsetMs = 7 * 60 * 60 * 1000;
            schedDate.setUTCHours(0, 0, 0, 0);
            schedDate.setTime(schedDate.getTime() + h * 3600000 + m * 60000 - wibOffsetMs);

            diffMins = Math.round((now.getTime() - schedDate.getTime()) / 60000);
            if (diffMins > 30) {
              isLate = true;
            }
          }
        }

        // Dapatkan pasangan PMO yang aktif untuk pasien ini
        const pairings = await this.pmoPatientRepository.find({
          where: { patientId: patient.id, status: 'active' },
          relations: ['pmo'],
        });

        for (const pair of pairings) {
          if (pair.pmo && pair.pmo.deviceToken) {
            const title = isLate ? 'Pasien Terlambat Minum Obat! ⚠️' : 'Perlu Verifikasi Bukti! 📷';
            const body = isLate
              ? `Pasien ${patient.name} mengunggah bukti secara TERLAMBAT untuk jadwal jam ${timeString}.`
              : `Pasien ${patient.name} baru saja mengunggah bukti minum obat untuk jadwal jam ${timeString || 'yang ditentukan'}.`;

            await this.firebaseService.sendPushNotification(
              pair.pmo.deviceToken,
              title,
              body,
              {
                type: 'need_verification',
                evidenceId: saved.id.toString(),
                patientId: patient.id.toString(),
              },
            );
          }
        }
      }
    } catch (err) {
      console.error('Gagal mengirim notifikasi bukti ke PMO:', err);
    }

    return this.toDto(saved);
  }

  async getEvidenceByUser(userId: string): Promise<EvidenceResponseDto[]> {
    const evidences = await this.evidenceRepository.find({
      where: { userId: parseInt(userId) },
      order: { createdAt: 'DESC' },
    });
    return evidences.map((e) => this.toDto(e));
  }

  async getEvidenceById(evidenceId: string): Promise<EvidenceResponseDto> {
    const evidence = await this.evidenceRepository.findOne({
      where: { id: parseInt(evidenceId) },
    });
    if (!evidence) throw new NotFoundException('Bukti tidak ditemukan');
    return this.toDto(evidence);
  }

  async verifyEvidence(
    evidenceId: string,
    updateEvidenceDto: UpdateEvidenceDto,
  ): Promise<EvidenceResponseDto> {
    const evidence = await this.evidenceRepository.findOne({
      where: { id: parseInt(evidenceId) },
    });
    if (!evidence) throw new NotFoundException('Bukti tidak ditemukan');

    evidence.verified = updateEvidenceDto.verified ?? evidence.verified;
    evidence.verifiedBy = updateEvidenceDto.verifiedBy ?? evidence.verifiedBy;
    evidence.status = updateEvidenceDto.verified ? 'verified' : 'rejected';
    if (updateEvidenceDto.verified) evidence.verifiedAt = new Date();

    const updated = await this.evidenceRepository.save(evidence);

    // Kirim notifikasi push ke pasien secara async tanpa menghalangi response utama
    try {
      const patient = await this.usersService.getUserById(
        updated.userId.toString(),
      );
      if (patient && patient.deviceToken) {
        const title =
          updated.status === 'verified'
            ? 'Bukti Kepatuhan Disetujui! 🎉'
            : 'Bukti Kepatuhan Ditolak ⚠️';
        const body =
          updated.status === 'verified'
            ? 'Selamat! Foto konsumsi obat Anda telah diverifikasi oleh PMO.'
            : 'Pesan PMO: Harap unggah ulang foto konsumsi obat yang benar.';

        await this.firebaseService.sendPushNotification(
          patient.deviceToken,
          title,
          body,
          {
            type: 'evidence_verification',
            status: updated.status,
            evidenceId: updated.id.toString(),
            sentAt: Date.now().toString(),
          },
        );
      }
    } catch (error) {
      console.error(
        'Failed to send push notification on evidence verification:',
        error,
      );
    }

    return this.toDto(updated);
  }

  // PMO: ambil semua bukti dari pasien yang terhubung (berdasarkan list patientIds)
  async getPendingEvidenceForPatients(
    patientIds: number[],
  ): Promise<EvidenceResponseDto[]> {
    if (patientIds.length === 0) return [];
    const evidences = await this.evidenceRepository
      .createQueryBuilder('e')
      .where('e.userId IN (:...patientIds)', { patientIds })
      .orderBy('e.createdAt', 'DESC')
      .getMany();
    return evidences.map((e) => this.toDto(e));
  }

  async getPendingEvidenceForPMO(): Promise<EvidenceResponseDto[]> {
    // Legacy — dipanggil dari controller lama
    const evidences = await this.evidenceRepository.find({
      where: { verified: false },
      order: { createdAt: 'DESC' },
    });
    return evidences.map((e) => this.toDto(e));
  }

  private toDto(evidence: Evidence): EvidenceResponseDto {
    return {
      id: evidence.id.toString(),
      userId: evidence.userId.toString(),
      scheduleId: evidence.scheduleId?.toString() || '',
      type: evidence.type as 'photo' | 'video',
      fileUrl: evidence.fileUrl || evidence.photoUrl || undefined,
      filePath: evidence.fileUrl || evidence.photoUrl || undefined,
      uploadedAt: evidence.createdAt,
      verified: evidence.verified,
      verifiedAt: evidence.verifiedAt || undefined,
      verifiedBy: evidence.verifiedBy || undefined,
      status: evidence.status,
      note: evidence.note || undefined,
    };
  }
}
