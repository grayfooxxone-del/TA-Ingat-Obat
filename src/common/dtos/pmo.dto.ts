import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class PairPatientDto {
  @IsString()
  @IsNotEmpty()
  patientCode: string;
}

export class MonitorPatientResponseDto {
  id: string;
  name: string;
  pairedDate: Date;
  status: 'active' | 'inactive';
  lastUpdate: Date;
  compliance: number;
  phone?: string;
  address?: string;
}

export class PMOVerificationDto {
  @IsString()
  @IsNotEmpty()
  evidenceId: string;

  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;

  @IsString()
  @IsOptional()
  reason?: string;
}
