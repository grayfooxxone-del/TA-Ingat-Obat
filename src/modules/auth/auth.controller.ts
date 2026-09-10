import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
} from '../../common/dtos/auth.dto';
import { UserResponseDto } from '../../common/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string; data: UserResponseDto }> {
    const user = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    this.authService.logout(token);
    return {
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  async getCurrentUser(
    @Headers('authorization') authHeader: string,
  ): Promise<{ data: UserResponseDto }> {
    const token = authHeader?.replace('Bearer ', '');
    const user = await this.authService.getCurrentUser(token);
    return {
      data: user,
    };
  }
}
