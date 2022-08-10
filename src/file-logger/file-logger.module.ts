import { Module } from '@nestjs/common';
import { FileLoggerService } from './file-logger.service';

@Module({
  providers: [FileLoggerService],
})
export class FileLoggerModule {}
