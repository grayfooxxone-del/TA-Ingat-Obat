import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from '../../common/dtos/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(id: string): Promise<import("./entities/user.entity").User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAccount(id: string): Promise<{
        message: string;
    }>;
    updateDeviceToken(body: {
        userId: string;
        deviceToken: string;
    }): Promise<{
        message: string;
    }>;
}
