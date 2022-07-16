import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [ParserController],
  providers: [ParserService, MessagesService],
})
export class ParserModule {}
