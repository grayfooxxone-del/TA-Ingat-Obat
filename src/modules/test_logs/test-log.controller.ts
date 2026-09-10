import { Controller, Post, Body } from '@nestjs/common';
import { TestLogService } from './test-log.service';
import { CreateTestLogDto } from './test-log.dto';

@Controller('test-log')
export class TestLogController {
  constructor(private readonly testLogService: TestLogService) {}

  @Post()
  async createLog(@Body() createTestLogDto: CreateTestLogDto) {
    const log = await this.testLogService.createLog(createTestLogDto);
    return {
      message: 'Log saved successfully',
      data: log,
    };
  }
}
