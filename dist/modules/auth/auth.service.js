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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        try {
            console.log('Register attempt with:', registerDto);
            const existingUser = await this.usersService.findByEmail(registerDto.email);
            if (existingUser) {
                const existingRole = existingUser.role === 'pmo' ? 'PMO (Pengawas Menelan Obat)' : 'Pasien';
                const attemptedRole = registerDto.role === 'pmo' ? 'PMO' : 'Pasien';
                if (existingUser.role === registerDto.role) {
                    throw new common_1.ConflictException(`Email sudah terdaftar sebagai ${existingRole}. Silakan login.`);
                }
                else {
                    throw new common_1.ConflictException(`Email ini sudah terdaftar sebagai ${existingRole}. Tidak dapat mendaftar sebagai ${attemptedRole} dengan email yang sama.`);
                }
            }
            const user = await this.usersService.create(registerDto);
            console.log('User created successfully:', user);
            return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                patientCode: user.patientCode,
                createdAt: user.createdAt,
            };
        }
        catch (error) {
            console.error('Register error:', error);
            if (error instanceof common_1.ConflictException)
                throw error;
            const err = error;
            if (err &&
                (err.code === '23505' || err.message?.includes('unique constraint'))) {
                throw new common_1.ConflictException('Email sudah terdaftar');
            }
            throw new common_1.InternalServerErrorException(err?.message || 'Gagal melakukan registrasi');
        }
    }
    async login(loginDto) {
        const { email, password, role } = loginDto;
        const user = await this.usersService.findByEmail(email);
        const isPasswordMatching = user
            ? await bcrypt.compare(password, user.password)
            : false;
        if (!user || !isPasswordMatching) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        if (role) {
            const userRole = user.role?.toLowerCase();
            const requestedRole = role?.toLowerCase();
            if (userRole !== requestedRole) {
                const registeredAs = userRole === 'pmo' ? 'PMO (Pengawas Menelan Obat)' : 'Pasien';
                const loginAs = requestedRole === 'pmo' ? 'PMO' : 'Pasien';
                throw new common_1.UnauthorizedException(`Akun ini terdaftar sebagai ${registeredAs}. Tidak dapat masuk sebagai ${loginAs}.`);
            }
        }
        const payload = {
            sub: user.id.toString(),
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        return {
            token,
            data: {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                patientCode: user.patientCode,
                createdAt: user.createdAt,
            },
        };
    }
    async getCurrentUser(token) {
        try {
            const actualToken = token.startsWith('Bearer ')
                ? token.substring(7)
                : token;
            const decoded = this.jwtService.verify(actualToken);
            const user = await this.usersService.findByEmail(decoded.email);
            if (!user)
                throw new common_1.UnauthorizedException('Sesi kadaluarsa');
            return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                patientCode: user.patientCode,
                createdAt: user.createdAt,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Sesi kadaluarsa');
        }
    }
    logout(token) {
        console.log(`User dengan token ${token} telah logout`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map