import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['patient', 'pmo'])
  role?: 'patient' | 'pmo';
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsIn(['patient', 'pmo'])
  role: 'patient' | 'pmo';

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

export class AuthResponseDto {
  token: string;
  data: {
    id: string;
    email: string;
    name: string;
    role: 'patient' | 'pmo';
    phone?: string;
    address?: string;
    dateOfBirth?: Date | string;
    patientCode?: string;
    createdAt: Date;
  };
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
