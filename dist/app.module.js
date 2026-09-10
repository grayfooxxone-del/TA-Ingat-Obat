"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const evidence_module_1 = require("./modules/evidence/evidence.module");
const medicines_module_1 = require("./modules/medicines/medicines.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const pmo_module_1 = require("./modules/pmo/pmo.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const admin_module_1 = require("./modules/admin/admin.module");
const iot_module_1 = require("./modules/iot/iot.module");
const firebase_module_1 = require("./modules/firebase/firebase.module");
const cloudinary_module_1 = require("./modules/cloudinary/cloudinary.module");
const test_log_module_1 = require("./modules/test_logs/test-log.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/public',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'Saif04knazz',
                database: process.env.DB_NAME || 'Pengingat Minum Obat TA',
                autoLoadEntities: true,
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            evidence_module_1.EvidenceModule,
            medicines_module_1.MedicinesModule,
            schedules_module_1.SchedulesModule,
            pmo_module_1.PMOModule,
            gamification_module_1.GamificationModule,
            admin_module_1.AdminModule,
            iot_module_1.IotModule,
            firebase_module_1.FirebaseModule,
            cloudinary_module_1.CloudinaryModule,
            test_log_module_1.TestLogModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map