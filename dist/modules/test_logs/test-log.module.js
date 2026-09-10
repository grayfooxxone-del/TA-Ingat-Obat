"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLogModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const test_log_entity_1 = require("./test-log.entity");
const test_log_controller_1 = require("./test-log.controller");
const test_log_service_1 = require("./test-log.service");
let TestLogModule = class TestLogModule {
};
exports.TestLogModule = TestLogModule;
exports.TestLogModule = TestLogModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([test_log_entity_1.TestLog])],
        controllers: [test_log_controller_1.TestLogController],
        providers: [test_log_service_1.TestLogService],
        exports: [test_log_service_1.TestLogService],
    })
], TestLogModule);
//# sourceMappingURL=test-log.module.js.map