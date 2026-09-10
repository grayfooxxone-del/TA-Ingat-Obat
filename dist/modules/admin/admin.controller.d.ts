import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class AdminController {
    private usersRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, dataSource: DataSource);
    clearUsers(): Promise<{
        message: string;
        timestamp: string;
    }>;
    seedTestUsers(): Promise<{
        message: string;
        userCount: number;
        info: string;
        users?: undefined;
        credentials?: undefined;
    } | {
        message: string;
        users: {
            id: number;
            email: string;
            name: string;
            role: string;
        }[];
        credentials: {
            patient: {
                email: string;
                password: string;
            };
            pmo: {
                email: string;
                password: string;
            };
        };
        userCount?: undefined;
        info?: undefined;
    }>;
}
