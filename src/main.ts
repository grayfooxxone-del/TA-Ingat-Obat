// [BELAJAR]
// Alamat File: src/main.ts
// Kegunaan File: File entri utama server NestJS. Mengaktifkan CORS, pipe validasi data, dan menjalankan port server.
// =========================================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan ini agar DTO bisa memvalidasi input dari Flutter
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(); // Penting agar Flutter bisa akses API
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
