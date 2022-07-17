import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParserModule } from './parser/parser.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ParserModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
