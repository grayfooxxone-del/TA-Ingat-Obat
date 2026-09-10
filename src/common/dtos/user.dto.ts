import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}

// Tambahkan class ini agar error TS2305 hilang
export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'pmo';
  phone?: string;
  address?: string;
  dateOfBirth?: Date | string;
  patientCode?: string;
  createdAt: Date;
}
