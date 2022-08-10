import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { MessagesService } from 'src/messages/messages.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigModule } from '@nestjs/config';
import { PointsSchema } from 'src/points/points.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminalsSchema } from 'src/terminals/terminals.model';
import { FileLoggerService } from 'src/file-logger/file-logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'points', schema: PointsSchema },
      { name: 'terminals', schema: TerminalsSchema },
    ]),
    ConfigModule,
  ],
  controllers: [],
  providers: [
    ParserService,
    MessagesService,
    StorageService,
    FileLoggerService,
  ],
})
export class ParserModule {}
