import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTestLogDto {
  @IsString()
  @IsNotEmpty()
  testType: string;

  // sentAt dikirim dari HP dalam format milidetik (Unix timestamp)
  @IsString()
  @IsNotEmpty()
  sentAt: string;

  // receivedAt dan delayMs sekarang dihitung oleh Server, jadi bersifat opsional dari HP
  @IsString()
  @IsOptional()
  receivedAt?: string;

  @IsNumber()
  @IsOptional()
  delayMs?: number;
}
