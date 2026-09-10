import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // Jalur absolut dan relatif fallback untuk menemukan file service account
    const pathsToTry = [
      path.resolve(
        process.cwd(),
        'src',
        'config',
        'firebase-service-account.json',
      ),
      path.resolve(
        __dirname,
        '..',
        '..',
        'config',
        'firebase-service-account.json',
      ),
      'c:\\Users\\Lenovo\\api\\src\\config\\firebase-service-account.json',
    ];

    let serviceAccountPath = '';
    for (const p of pathsToTry) {
      if (fs.existsSync(p)) {
        serviceAccountPath = p;
        break;
      }
    }

    if (!serviceAccountPath) {
      console.error(
        'CRITICAL: firebase-service-account.json not found in any path!',
      );
      return;
    }

    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert(serviceAccountPath),
        });
        console.log(
          'Firebase Admin SDK initialized successfully using:',
          serviceAccountPath,
        );
      }
    } catch (error) {
      console.error('Firebase Admin SDK initialization failed:', error);
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<boolean> {
    if (!token) {
      console.log('Push notification skipped: No device token provided.');
      return false;
    }

    const message: Message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    try {
      const response = await getMessaging().send(message);
      console.log('Successfully sent push notification:', response);
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }
}
