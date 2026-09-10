import { OnModuleInit } from '@nestjs/common';
export declare class FirebaseService implements OnModuleInit {
    onModuleInit(): void;
    sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
}
