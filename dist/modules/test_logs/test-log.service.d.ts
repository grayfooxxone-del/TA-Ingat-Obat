import { Repository } from 'typeorm';
import { TestLog } from './test-log.entity';
import { CreateTestLogDto } from './test-log.dto';
export declare class TestLogService {
    private testLogRepository;
    private readonly logger;
    private toWIB;
    private translateTestType;
    constructor(testLogRepository: Repository<TestLog>);
    createLog(createTestLogDto: CreateTestLogDto): Promise<TestLog>;
}
