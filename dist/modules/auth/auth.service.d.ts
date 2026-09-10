import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, AuthResponseDto } from '../../common/dtos/auth.dto';
import { UserResponseDto } from '../../common/dtos/user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getCurrentUser(token: string): Promise<UserResponseDto>;
    logout(token: string): void;
}
