import { TestLogService } from './test-log.service';
import { CreateTestLogDto } from './test-log.dto';
export declare class TestLogController {
    private readonly testLogService;
    constructor(testLogService: TestLogService);
    createLog(createTestLogDto: CreateTestLogDto): Promise<{
        message: string;
        data: import("./test-log.entity").TestLog;
    }>;
}
