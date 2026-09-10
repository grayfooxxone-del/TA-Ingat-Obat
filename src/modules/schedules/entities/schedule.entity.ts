import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  medicineId: number;

  @Column({ nullable: true })
  medicineName: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  frequency: string;

  @Column()
  time: string;

  @Column()
  day: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string; // 'PENDING' | 'COMPLIANT' | 'LATE' | 'MISSED' | 'WAITING'

  @Column({ default: false })
  isTemplate: boolean;

  @Column({ nullable: true })
  templateId: number;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Medicine, { eager: false, nullable: true })
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;
}
