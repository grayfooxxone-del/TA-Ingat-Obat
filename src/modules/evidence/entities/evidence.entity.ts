import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('evidence')
export class Evidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  scheduleId: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.evidences)
  @JoinColumn({ name: 'userId' })
  user: User;
}
