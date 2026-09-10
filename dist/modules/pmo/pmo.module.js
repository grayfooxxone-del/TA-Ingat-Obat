"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PMOModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pmo_controller_1 = require("./pmo.controller");
const pmo_service_1 = require("./pmo.service");
const users_module_1 = require("../users/users.module");
const pmo_patient_entity_1 = require("./entities/pmo-patient.entity");
const evidence_module_1 = require("../evidence/evidence.module");
const gamification_module_1 = require("../gamification/gamification.module");
const schedules_module_1 = require("../schedules/schedules.module");
let PMOModule = class PMOModule {
};
exports.PMOModule = PMOModule;
exports.PMOModule = PMOModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pmo_patient_entity_1.PmoPatient]),
            users_module_1.UsersModule,
            evidence_module_1.EvidenceModule,
            gamification_module_1.GamificationModule,
            schedules_module_1.SchedulesModule,
        ],
        controllers: [pmo_controller_1.PMOController],
        providers: [pmo_service_1.PMOService],
        exports: [pmo_service_1.PMOService],
    })
], PMOModule);
//# sourceMappingURL=pmo.module.js.map