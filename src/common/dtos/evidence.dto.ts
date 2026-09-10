import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateEvidenceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @IsIn(['photo', 'video', 'image'])
  @IsNotEmpty()
  type: 'photo' | 'video';

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateEvidenceDto {
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @IsOptional()
  verifiedAt?: Date;

  @IsString()
  @IsOptional()
  verifiedBy?: string;
}

export class EvidenceResponseDto {
  id!: string;
  userId!: string;
  scheduleId: string;
  type: 'photo' | 'video';
  filePath?: string;
  fileUrl?: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  status?: string;
  note?: string;
}
