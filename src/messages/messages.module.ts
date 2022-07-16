import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Module({
  controllers: [],
  providers: [MessagesService],
})
export class MessagesModule {}
