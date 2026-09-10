import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Evidence } from '../../evidence/entities/evidence.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'patient' })
  role: string; // Di database tetap string

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true, unique: true })
  patientCode?: string;

  // --- IOT COLUMNS ---
  @Column({ nullable: true })
  iotDeviceId?: string; // ID unik alat ESP32 (misal: "ESP32Box-1234")

  @Column({ nullable: true })
  iotStatus?: string; // "Hidup" atau "Mati"

  @Column({ nullable: true })
  boxStatus?: string; // "TERBUKA" atau "TERTUTUP"

  @Column({ type: 'int', nullable: true })
  batteryLevel?: number; // 0 - 100

  @Column({ type: 'timestamp', nullable: true })
  lastOpenedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastIotUpdateAt?: Date; // Waktu terakhir alat nge-ping

  @Column({ nullable: true })
  deviceToken?: string;

  @CreateDateColumn()
  createdAt: Date; // TAMBAHKAN INI agar error TS2339 hilang

  @OneToMany(() => Evidence, (evidence) => evidence.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  evidences: Evidence[];
}
