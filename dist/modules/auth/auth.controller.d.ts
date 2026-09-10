import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from '../../common/dtos/auth.dto';
import { UserResponseDto } from '../../common/dtos/user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: UserResponseDto;
    }>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    logout(authHeader: string): {
        message: string;
    };
    getCurrentUser(authHeader: string): Promise<{
        data: UserResponseDto;
    }>;
}
