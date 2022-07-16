import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';

@Module({
  controllers: [ParserController],
  providers: [ParserService],
})
export class ParserModule {}
