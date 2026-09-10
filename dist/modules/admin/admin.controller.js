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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let AdminController = class AdminController {
    constructor(usersRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.dataSource = dataSource;
    }
    async clearUsers() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query('DELETE FROM users');
            await queryRunner.commitTransaction();
            return {
                message: 'All users cleared successfully',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            const err = error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to clear users',
                details: err?.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async seedTestUsers() {
        try {
            const existingUserCount = await this.usersRepository.count();
            if (existingUserCount > 0) {
                return {
                    message: 'Test users already exist',
                    userCount: existingUserCount,
                    info: 'Clear users first with DELETE /admin/clear-users if you want fresh data',
                };
            }
            const testUsers = [
                {
                    email: 'pasien@test.com',
                    password: 'password123',
                    name: 'Test Patient',
                    role: 'patient',
                    phone: '0812345678',
                },
                {
                    email: 'pmo@test.com',
                    password: 'password123',
                    name: 'Test PMO',
                    role: 'pmo',
                    phone: '0812345679',
                },
            ];
            const savedUsers = await this.usersRepository.save(testUsers);
            return {
                message: 'Test users seeded successfully',
                users: savedUsers.map((u) => ({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                })),
                credentials: {
                    patient: { email: 'pasien@test.com', password: 'password123' },
                    pmo: { email: 'pmo@test.com', password: 'password123' },
                },
            };
        }
        catch (error) {
            const err = error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to seed test users',
                details: err?.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Delete)('clear-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "clearUsers", null);
__decorate([
    (0, common_1.Post)('seed-test-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "seedTestUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AdminController);
//# sourceMappingURL=admin.controller.js.map