import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { BadRequestException } from '../../http-exceptions/errors-for-terminal/bad-request.error';
import { LoginMessage } from './login.class';
import { Message } from './message.class';
import { ShortDataMessage } from './short-data.class';

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
      default:
        throw new BadRequestException();
    }

    return message;
  }
}
