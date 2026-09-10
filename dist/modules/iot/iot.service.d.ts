import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IotDeviceLog } from './entities/iot-device-log.entity';
export declare class IotService implements OnModuleInit, OnModuleDestroy {
    private readonly userRepository;
    private readonly iotDeviceLogRepository;
    private client;
    private readonly logger;
    private readonly MQTT_URL;
    private readonly MQTT_USERNAME;
    private readonly MQTT_PASSWORD;
    constructor(userRepository: Repository<User>, iotDeviceLogRepository: Repository<IotDeviceLog>);
    private offlineCheckInterval;
    onModuleInit(): void;
    onModuleDestroy(): void;
    private connectToBroker;
    private handleIncomingMessage;
    checkOfflineDevices(): Promise<void>;
}
