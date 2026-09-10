import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
} from '../../common/dtos/auth.dto';
import { UserResponseDto } from '../../common/dtos/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    try {
      console.log('Register attempt with:', registerDto);

      // === CEK POIN 1 & 2: Email sudah terdaftar? ===
      const existingUser = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        const existingRole =
          existingUser.role === 'pmo' ? 'PMO (Pengawas Menelan Obat)' : 'Pasien';
        const attemptedRole = registerDto.role === 'pmo' ? 'PMO' : 'Pasien';

        if (existingUser.role === registerDto.role) {
          // Daftar ke role yang SAMA dengan yang sudah ada
          throw new ConflictException(
            `Email sudah terdaftar sebagai ${existingRole}. Silakan login.`,
          );
        } else {
          // Daftar ke role BERBEDA dengan yang sudah ada
          throw new ConflictException(
            `Email ini sudah terdaftar sebagai ${existingRole}. Tidak dapat mendaftar sebagai ${attemptedRole} dengan email yang sama.`,
          );
        }
      }

      const user = await this.usersService.create(registerDto);
      console.log('User created successfully:', user);

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role as 'patient' | 'pmo',
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        patientCode: user.patientCode,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('Register error:', error);

      if (error instanceof ConflictException) throw error;

      const err = error as { code?: string; message?: string };
      // Fallback untuk unique constraint error dari DB (double-check safety net)
      if (
        err &&
        (err.code === '23505' || err.message?.includes('unique constraint'))
      ) {
        throw new ConflictException('Email sudah terdaftar');
      }

      throw new InternalServerErrorException(
        err?.message || 'Gagal melakukan registrasi',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password, role } = loginDto;
    const user = await this.usersService.findByEmail(email);

    // === CEK POIN 3: Email tidak ditemukan atau password salah ===
    const isPasswordMatching = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isPasswordMatching) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // === CEK POIN 3: Role yang dipilih saat login harus cocok dengan role di database ===
    if (role) {
      const userRole = user.role?.toLowerCase();
      const requestedRole = role?.toLowerCase();

      if (userRole !== requestedRole) {
        const registeredAs =
          userRole === 'pmo' ? 'PMO (Pengawas Menelan Obat)' : 'Pasien';
        const loginAs = requestedRole === 'pmo' ? 'PMO' : 'Pasien';
        throw new UnauthorizedException(
          `Akun ini terdaftar sebagai ${registeredAs}. Tidak dapat masuk sebagai ${loginAs}.`,
        );
      }
    }

    // Real token generation
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      data: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role as 'patient' | 'pmo',
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        patientCode: user.patientCode,
        createdAt: user.createdAt,
      },
    };
  }

  async getCurrentUser(token: string): Promise<UserResponseDto> {
    try {
      const actualToken = token.startsWith('Bearer ')
        ? token.substring(7)
        : token;
      const decoded = this.jwtService.verify(actualToken) as unknown as {
        email: string;
      };
      const user = await this.usersService.findByEmail(decoded.email);

      if (!user) throw new UnauthorizedException('Sesi kadaluarsa');

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role as 'patient' | 'pmo',
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        patientCode: user.patientCode,
        createdAt: user.createdAt,
      };
    } catch {
      throw new UnauthorizedException('Sesi kadaluarsa');
    }
  }

  logout(token: string): void {
    // Untuk stateless JWT, biasanya client cukup menghapus token di sisi mereka.
    console.log(`User dengan token ${token} telah logout`);
  }
}
