import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pmo_patients')
export class PmoPatient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pmoId: number;

  @Column()
  patientId: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  pairedAt: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'pmoId' })
  pmo: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'patientId' })
  patient: User;
}
