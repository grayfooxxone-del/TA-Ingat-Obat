"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const path = require("path");
const fs = require("fs");
let FirebaseService = class FirebaseService {
    onModuleInit() {
        const pathsToTry = [
            path.resolve(process.cwd(), 'src', 'config', 'firebase-service-account.json'),
            path.resolve(__dirname, '..', '..', 'config', 'firebase-service-account.json'),
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
            console.error('CRITICAL: firebase-service-account.json not found in any path!');
            return;
        }
        try {
            if ((0, app_1.getApps)().length === 0) {
                (0, app_1.initializeApp)({
                    credential: (0, app_1.cert)(serviceAccountPath),
                });
                console.log('Firebase Admin SDK initialized successfully using:', serviceAccountPath);
            }
        }
        catch (error) {
            console.error('Firebase Admin SDK initialization failed:', error);
        }
    }
    async sendPushNotification(token, title, body, data = {}) {
        if (!token) {
            console.log('Push notification skipped: No device token provided.');
            return false;
        }
        const message = {
            notification: {
                title,
                body,
            },
            data,
            token,
        };
        try {
            const response = await (0, messaging_1.getMessaging)().send(message);
            console.log('Successfully sent push notification:', response);
            return true;
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            return false;
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)()
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map