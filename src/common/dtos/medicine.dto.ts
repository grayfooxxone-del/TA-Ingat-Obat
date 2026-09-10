import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  medicineName: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  frequency?: string;
}

export class UpdateMedicineDto {
  @IsString()
  @IsOptional()
  medicineName?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  frequency?: string;
}

export class MedicineResponseDto {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  unit: string;
  frequency: 'once' | 'twice' | 'thrice';
  createdAt: Date;
  updatedAt?: Date;
}
