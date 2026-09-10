import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from '../../common/dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Post(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(id, changePasswordDto);
    return { success: true, message: 'Password berhasil diubah' };
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    return await this.usersService.deleteAccount(id);
  }

  @Post('device-token')
  async updateDeviceToken(
    @Body() body: { userId: string; deviceToken: string },
  ) {
    await this.usersService.updateDeviceToken(body.userId, body.deviceToken);
    return {
      message: 'Device token updated successfully',
    };
  }
}
