import {
  Controller,
  Delete,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  @Delete('clear-users')
  async clearUsers() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Menggunakan queryRunner untuk eksekusi yang lebih aman
      await queryRunner.query('DELETE FROM users');
      await queryRunner.commitTransaction();

      return {
        message: 'All users cleared successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Rollback jika terjadi kesalahan
      await queryRunner.rollbackTransaction();

      const err = error as { message?: string };
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to clear users',
          details: err?.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // WAJIB: Selalu release queryRunner agar tidak memory leak/depreciation warning
      await queryRunner.release();
    }
  }

  @Post('seed-test-users')
  async seedTestUsers() {
    try {
      // Cek apakah sudah ada user
      const existingUserCount = await this.usersRepository.count();
      if (existingUserCount > 0) {
        return {
          message: 'Test users already exist',
          userCount: existingUserCount,
          info: 'Clear users first with DELETE /admin/clear-users if you want fresh data',
        };
      }

      // Create test users
      const testUsers = [
        {
          email: 'pasien@test.com',
          password: 'password123',
          name: 'Test Patient',
          role: 'patient',
          phone: '0812345678',
        },
        {
          email: 'pmo@test.com',
          password: 'password123',
          name: 'Test PMO',
          role: 'pmo',
          phone: '0812345679',
        },
      ];

      const savedUsers = await this.usersRepository.save(testUsers);

      return {
        message: 'Test users seeded successfully',
        users: savedUsers.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
        })),
        credentials: {
          patient: { email: 'pasien@test.com', password: 'password123' },
          pmo: { email: 'pmo@test.com', password: 'password123' },
        },
      };
    } catch (error) {
      const err = error as { message?: string };
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to seed test users',
          details: err?.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
