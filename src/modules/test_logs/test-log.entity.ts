import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('test_logs')
export class TestLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testType: string;

  @Column()
  sentAt: string;

  @Column()
  receivedAt: string;

  @Column('int')
  delayMs: number;

  @CreateDateColumn()
  createdAt: Date;
}
