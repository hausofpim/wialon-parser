import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { MessagesService } from 'src/messages/messages.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ParserService, MessagesService, StorageService],
})
export class ParserModule {}
