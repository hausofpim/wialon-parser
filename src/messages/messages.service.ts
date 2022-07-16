import { Injectable } from '@nestjs/common';
import { MessagesFactory } from './classes/messages-factory.class';

@Injectable()
export class MessagesService {
  async parseMessage(messageType: string, messageBody: string) {
    const messageFactory = new MessagesFactory();

    const message = messageFactory.create(messageType);
    const result = await message.parseMessage(messageBody);

    return result;
  }
}
