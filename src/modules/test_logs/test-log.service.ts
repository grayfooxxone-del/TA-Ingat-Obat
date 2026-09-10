import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestLog } from './test-log.entity';
import { CreateTestLogDto } from './test-log.dto';

@Injectable()
export class TestLogService {
  private readonly logger = new Logger(TestLogService.name);

  private toWIB(date: Date): string {
    const wibOffset = 7 * 60 * 60 * 1000;
    const wibDate = new Date(date.getTime() + wibOffset);
    const iso = wibDate.toISOString().replace('T', ' ').replace('Z', '');
    return `${iso} WIB`;
  }

  private translateTestType(raw: string): string {
    const map: Record<string, string> = {
      FCM_REMINDER: 'Ingatkan Pasien',
      FCM_VERIFICATION: 'Verifikasi Bukti',
      IOT_OPEN: 'Status Kotak (Tutup → Buka)',
      IOT_CLOSE: 'Status Kotak (Buka → Tutup)',
    };
    return map[raw] ?? raw;
  }

  constructor(
    @InjectRepository(TestLog)
    private testLogRepository: Repository<TestLog>,
  ) {}

  async createLog(createTestLogDto: CreateTestLogDto): Promise<TestLog> {
    // Parse sentAt - handle both Unix ms timestamp and ISO string format
    const sentAtRaw = createTestLogDto.sentAt;
    let sentAtMs: number;
    if (/^\d+$/.test(sentAtRaw.trim())) {
      sentAtMs = parseInt(sentAtRaw);
    } else {
      sentAtMs = new Date(sentAtRaw).getTime();
    }

    // Server menentukan receivedAt sendiri agar delay akurat (tidak bergantung jam HP)
    const now = new Date();
    const receivedAtMs = now.getTime();
    const delayMs = Math.max(0, receivedAtMs - sentAtMs);

    const sentAtWib = this.toWIB(new Date(sentAtMs));
    const receivedAtWib = this.toWIB(now);
    const namaUji = this.translateTestType(createTestLogDto.testType);

    const newLog = this.testLogRepository.create({
      testType: namaUji,
      sentAt: sentAtWib,
      receivedAt: receivedAtWib,
      delayMs: delayMs,
    });
    const savedLog = await this.testLogRepository.save(newLog);

    this.logger.log(`[UJI SKRIPSI] Jenis Uji  : ${namaUji}`);
    this.logger.log(`> Waktu Kirim  : ${sentAtWib}`);
    this.logger.log(`> Waktu Terima : ${receivedAtWib}`);
    this.logger.log(`> TOTAL DELAY  : ${delayMs} milidetik`);

    return savedLog;
  }
}
