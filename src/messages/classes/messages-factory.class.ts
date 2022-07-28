import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { BadRequestException } from '../../http-exceptions/errors-for-terminal/bad-request.error';
import { DataMessage } from './data.class';
import { LoginMessage } from './login.class';
import { PingMessage } from './ping.class';
import { Message } from './message.class';
import { ShortDataMessage } from './short-data.class';
import { BlackboxMessage } from './blackbox.class';

export class MessagesFactory {
  create(messageType: string) {
    let message: Message;
    switch (messageType) {
      case TerminalCodes.LOGIN_PACKET_REQUEST:
        message = new LoginMessage();
        break;
      case TerminalCodes.SHORT_DATA_PACKET_REQUEST:
        message = new ShortDataMessage();
        break;
      case TerminalCodes.DATA_PACKET_REQUEST:
        message = new DataMessage();
        break;
      case TerminalCodes.PING_PACKET_REQUEST:
        message = new PingMessage();
        break;
      case TerminalCodes.BLACKBOX_PACKET_REQUEST:
        message = new BlackboxMessage();
        break;
      default:
        throw new BadRequestException();
    }

    return message;
  }
}
