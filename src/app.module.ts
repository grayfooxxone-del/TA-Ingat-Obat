// [BELAJAR]
// Alamat File: src/app.module.ts
// Kegunaan File: Modul utama (Root Module) NestJS yang menghubungkan database PostgreSQL, modul otentikasi, gamifikasi, dan modul lainnya.
// =========================================================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { PMOModule } from './modules/pmo/pmo.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { AdminModule } from './modules/admin/admin.module';
import { IotModule } from './modules/iot/iot.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { TestLogModule } from './modules/test_logs/test-log.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
          }
        : {
            host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
            port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
            username: process.env.DB_USERNAME || process.env.PGUSER || 'postgres',
            password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'Saif04knazz',
            database: process.env.DB_NAME || process.env.PGDATABASE || 'Pengingat Minum Obat TA',
          }),
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    EvidenceModule,
    MedicinesModule,
    SchedulesModule,
    PMOModule,
    GamificationModule,
    AdminModule,
    IotModule,
    FirebaseModule,
    CloudinaryModule,
    TestLogModule,
  ],
})
export class AppModule {} // Pastikan baris ini ada agar tidak error di main.ts
