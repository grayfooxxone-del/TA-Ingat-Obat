import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { IotDeviceLog } from './entities/iot-device-log.entity';
import { IotService } from './iot.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, IotDeviceLog])],
  providers: [IotService],
  exports: [IotService],
})
export class IotModule {}
