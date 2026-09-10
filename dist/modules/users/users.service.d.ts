import { Repository } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { User } from './entities/user.entity';
import { UpdateUserDto } from '../../common/dtos/user.dto';
import { RegisterDto, ChangePasswordDto } from '../../common/dtos/auth.dto';
export declare class UsersService {
    private usersRepository;
    private moduleRef;
    constructor(usersRepository: Repository<User>, moduleRef: ModuleRef);
    create(registerDto: RegisterDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByPatientCode(patientCode: string): Promise<User | null>;
    getUserById(id: string): Promise<User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<boolean>;
    deleteAccount(id: string): Promise<{
        message: string;
    }>;
    updateDeviceToken(id: string, deviceToken: string): Promise<boolean>;
}
