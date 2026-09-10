import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsOptional()
  medicineId?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  time: string; // HH:mm format

  @IsString()
  @IsNotEmpty()
  day: string;

  @IsString()
  @IsOptional()
  medicineName?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateScheduleDto {
  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  day?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsString()
  @IsOptional()
  medicineId?: string;

  @IsString()
  @IsOptional()
  medicineName?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class ScheduleResponseDto {
  id: string;
  medicineId: string;
  userId: string;
  time: string;
  day: string;
  medicineName?: string;
  dosage?: string;
  frequency?: string;
  notes?: string;
  completed: boolean;
  completedAt?: Date;
  status?: string;
  isTemplate?: boolean;
  templateId?: number;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
