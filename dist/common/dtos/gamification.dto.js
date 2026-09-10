"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationResponseDto = exports.StreakDto = exports.BadgeDto = exports.UpdateGamificationDto = exports.CreateGamificationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateGamificationDto {
}
exports.CreateGamificationDto = CreateGamificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGamificationDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateGamificationDto.prototype, "points", void 0);
class UpdateGamificationDto {
}
exports.UpdateGamificationDto = UpdateGamificationDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateGamificationDto.prototype, "points", void 0);
class BadgeDto {
}
exports.BadgeDto = BadgeDto;
class StreakDto {
}
exports.StreakDto = StreakDto;
class GamificationResponseDto {
}
exports.GamificationResponseDto = GamificationResponseDto;
//# sourceMappingURL=gamification.dto.js.map