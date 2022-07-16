import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { BadRequestException } from '../../http-exceptions/errors-for-terminal/bad-request.error';
import { LoginMessage } from './login-message.class';
import { Message } from './message.class';

export class MessagesFactory {
  create(messageType: string) {
    let message: Message;
    switch (messageType) {
      case TerminalCodes.LOGIN_PACKET_REQUEST:
        message = new LoginMessage();
        break;
      default:
        throw new BadRequestException();
    }

    return message;
  }
}
