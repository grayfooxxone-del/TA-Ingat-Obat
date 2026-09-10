import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from '../../common/dtos/user.dto';
import { RegisterDto, ChangePasswordDto } from '../../common/dtos/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private moduleRef: ModuleRef,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const { dateOfBirth, ...userFields } = registerDto;

    let parsedDate: Date | undefined = undefined;
    if (dateOfBirth) {
      const dateStr = dateOfBirth.toString();
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          parsedDate = new Date(`${year}-${month}-${day}`);
        }
      } else {
        parsedDate = new Date(dateOfBirth);
      }

      if (parsedDate && isNaN(parsedDate.getTime())) {
        parsedDate = undefined;
      }
    }

    const newUser = this.usersRepository.create({
      ...userFields,
      password: hashedPassword,
      dateOfBirth: parsedDate,
    } as Partial<User>);

    if (!newUser.role || newUser.role === 'patient') {
      const emailPrefix = newUser.email
        ? newUser.email.substring(0, 3).toUpperCase()
        : 'PAT';
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      newUser.patientCode = `${emailPrefix}-${randomDigits}`;
    }

    const savedUser = await this.usersRepository.save(newUser);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByPatientCode(patientCode: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { patientCode, role: 'patient' },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.getUserById(id);
    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Password lama tidak cocok');
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersRepository.save(user);
    return true;
  }

  async deleteAccount(id: string): Promise<{ message: string }> {
    const user = await this.getUserById(id);

    // Cascade delete all related data from in-memory services
    try {
      const medicineService = (await this.moduleRef
        .resolve('MedicineService')
        .catch(() => null)) as {
        deleteByUserId?: (id: string) => Promise<void>;
      } | null;
      if (
        medicineService &&
        typeof medicineService.deleteByUserId === 'function'
      ) {
        await medicineService.deleteByUserId(id);
      }

      const scheduleService = (await this.moduleRef
        .resolve('ScheduleService')
        .catch(() => null)) as {
        deleteByUserId?: (id: string) => Promise<void>;
      } | null;
      if (
        scheduleService &&
        typeof scheduleService.deleteByUserId === 'function'
      ) {
        await scheduleService.deleteByUserId(id);
      }

      const gamificationService = (await this.moduleRef
        .resolve('GamificationService')
        .catch(() => null)) as {
        deleteByUserId?: (id: string) => Promise<void>;
      } | null;
      if (
        gamificationService &&
        typeof gamificationService.deleteByUserId === 'function'
      ) {
        await gamificationService.deleteByUserId(id);
      }

      const pmoService = (await this.moduleRef
        .resolve('PMOService')
        .catch(() => null)) as {
        deleteByUserId?: (id: string) => Promise<void>;
      } | null;
      if (pmoService && typeof pmoService.deleteByUserId === 'function') {
        await pmoService.deleteByUserId(id);
      }
    } catch (error) {
      console.error('Error deleting related in-memory data:', error);
      // Continue with user deletion even if related data deletion fails
    }

    // Delete user from database
    // Evidence and other TypeORM-related data will be cascaded deleted via CASCADE constraint
    await this.usersRepository.remove(user);

    return { message: 'Account dan semua data terkait berhasil dihapus' };
  }

  async updateDeviceToken(id: string, deviceToken: string): Promise<boolean> {
    const user = await this.getUserById(id);
    user.deviceToken = deviceToken;
    await this.usersRepository.save(user);
    return true;
  }
}
