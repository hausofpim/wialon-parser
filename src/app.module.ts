import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getMongoDbConfig } from './config/mongo.config';
import { ParserModule } from './parser/parser.module';
import { StorageModule } from './storage/storage.module';
import { FileLoggerModule } from './file-logger/file-logger.module';

@Module({
  imports: [
    ParserModule,
    StorageModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig,
    }),
    FileLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
