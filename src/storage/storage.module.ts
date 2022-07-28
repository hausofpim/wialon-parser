import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [StorageService],
})
export class StorageModule {}
