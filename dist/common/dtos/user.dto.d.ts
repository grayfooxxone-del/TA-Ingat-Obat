export declare class UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: 'patient' | 'pmo';
    phone?: string;
    address?: string;
    dateOfBirth?: Date | string;
    patientCode?: string;
    createdAt: Date;
}
