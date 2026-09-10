import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('iot_device_logs')
export class IotDeviceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientCode: string;

  @Column()
  eventType: string; // 'BOX_OPENED' | 'BOX_CLOSED' | 'PING' | 'LOW_BATTERY' | 'OFFLINE'

  @Column({ type: 'int', nullable: true })
  batteryLevel: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  rawPayload: any;
}
