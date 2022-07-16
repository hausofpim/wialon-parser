import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { BadLoginMessage } from 'src/http-exceptions/errors-for-terminal/bad-login-message.error';
import { Message } from './message.class';

export class LoginMessage extends Message {
  messageType = TerminalCodes.LOGIN_PACKET_REQUEST;
  responseType = TerminalCodes.LOGIN_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(messageParams: string) {
    const paramsFromMessage = messageParams.split(';');

    if (
      paramsFromMessage.length === 2 &&
      paramsFromMessage[0] &&
      paramsFromMessage[1]
    ) {
      return {
        data: {
          imei: paramsFromMessage[0],
          password: paramsFromMessage[1],
        },
        response: this.generateMessageResponse(),
      };
    } else {
      throw new BadLoginMessage();
    }
  }

  generateMessageResponse() {
    return `#${TerminalCodes.LOGIN_PACKET_RESPONSE}#1\\r\\n`;
  }
}
