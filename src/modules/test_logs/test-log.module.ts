import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestLog } from './test-log.entity';
import { TestLogController } from './test-log.controller';
import { TestLogService } from './test-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestLog])],
  controllers: [TestLogController],
  providers: [TestLogService],
  exports: [TestLogService],
})
export class TestLogModule {}
