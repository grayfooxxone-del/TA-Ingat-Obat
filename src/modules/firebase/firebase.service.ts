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

    let credentialConfig;
    if (process.env.FIREBASE_JSON) {
      try {
        const serviceAccountConfig = JSON.parse(process.env.FIREBASE_JSON);
        credentialConfig = cert(serviceAccountConfig);
        console.log('Firebase Admin SDK initialized using FIREBASE_JSON env var.');
      } catch (err) {
        console.error('Failed to parse FIREBASE_JSON env var:', err);
        return;
      }
    } else if (serviceAccountPath) {
      credentialConfig = cert(serviceAccountPath);
      console.log('Firebase Admin SDK initialized using file:', serviceAccountPath);
    } else {
      console.error('CRITICAL: firebase-service-account.json not found and FIREBASE_JSON is not set!');
      return;
    }

    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: credentialConfig,
        });
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
