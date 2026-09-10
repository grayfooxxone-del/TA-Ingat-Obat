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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_1 = require("@nestjs/core");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository, moduleRef) {
        this.usersRepository = usersRepository;
        this.moduleRef = moduleRef;
    }
    async create(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const { dateOfBirth, ...userFields } = registerDto;
        let parsedDate = undefined;
        if (dateOfBirth) {
            const dateStr = dateOfBirth.toString();
            if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    parsedDate = new Date(`${year}-${month}-${day}`);
                }
            }
            else {
                parsedDate = new Date(dateOfBirth);
            }
            if (parsedDate && isNaN(parsedDate.getTime())) {
                parsedDate = undefined;
            }
        }
        const newUser = this.usersRepository.create({
            ...userFields,
            password: hashedPassword,
            dateOfBirth: parsedDate,
        });
        if (!newUser.role || newUser.role === 'patient') {
            const emailPrefix = newUser.email
                ? newUser.email.substring(0, 3).toUpperCase()
                : 'PAT';
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            newUser.patientCode = `${emailPrefix}-${randomDigits}`;
        }
        const savedUser = await this.usersRepository.save(newUser);
        return savedUser;
    }
    async findByEmail(email) {
        return await this.usersRepository.findOne({ where: { email } });
    }
    async findByPatientCode(patientCode) {
        return await this.usersRepository.findOne({
            where: { patientCode, role: 'patient' },
        });
    }
    async getUserById(id) {
        const user = await this.usersRepository.findOne({
            where: { id: parseInt(id, 10) },
        });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        return user;
    }
    async updateUser(id, updateUserDto) {
        await this.usersRepository.update(id, updateUserDto);
        return this.getUserById(id);
    }
    async changePassword(id, changePasswordDto) {
        const user = await this.getUserById(id);
        const isPasswordMatching = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Password lama tidak cocok');
        }
        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.usersRepository.save(user);
        return true;
    }
    async deleteAccount(id) {
        const user = await this.getUserById(id);
        try {
            const medicineService = (await this.moduleRef
                .resolve('MedicineService')
                .catch(() => null));
            if (medicineService &&
                typeof medicineService.deleteByUserId === 'function') {
                await medicineService.deleteByUserId(id);
            }
            const scheduleService = (await this.moduleRef
                .resolve('ScheduleService')
                .catch(() => null));
            if (scheduleService &&
                typeof scheduleService.deleteByUserId === 'function') {
                await scheduleService.deleteByUserId(id);
            }
            const gamificationService = (await this.moduleRef
                .resolve('GamificationService')
                .catch(() => null));
            if (gamificationService &&
                typeof gamificationService.deleteByUserId === 'function') {
                await gamificationService.deleteByUserId(id);
            }
            const pmoService = (await this.moduleRef
                .resolve('PMOService')
                .catch(() => null));
            if (pmoService && typeof pmoService.deleteByUserId === 'function') {
                await pmoService.deleteByUserId(id);
            }
        }
        catch (error) {
            console.error('Error deleting related in-memory data:', error);
        }
        await this.usersRepository.remove(user);
        return { message: 'Account dan semua data terkait berhasil dihapus' };
    }
    async updateDeviceToken(id, deviceToken) {
        const user = await this.getUserById(id);
        user.deviceToken = deviceToken;
        await this.usersRepository.save(user);
        return true;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        core_1.ModuleRef])
], UsersService);
//# sourceMappingURL=users.service.js.map