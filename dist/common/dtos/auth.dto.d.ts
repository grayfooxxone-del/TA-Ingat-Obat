export declare class LoginDto {
    email: string;
    password: string;
    role?: 'patient' | 'pmo';
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'pmo';
    phone?: string;
    address?: string;
    dateOfBirth?: string;
}
export declare class AuthResponseDto {
    token: string;
    data: {
        id: string;
        email: string;
        name: string;
        role: 'patient' | 'pmo';
        phone?: string;
        address?: string;
        dateOfBirth?: Date | string;
        patientCode?: string;
        createdAt: Date;
    };
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
