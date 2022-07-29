import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { BadLoginMessage } from 'src/http-exceptions/errors-for-terminal/bad-login-message.error';
import { Message } from './message.class';
import { LoginMessageData } from 'src/types/message-data-types/login.type';
import { MessageSuccessResponse } from 'src/types/message-success-response.type';

export class LoginMessage extends Message {
  messageType = TerminalCodes.LOGIN_PACKET_REQUEST;
  responseType = TerminalCodes.LOGIN_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(
    messageParams: string,
  ): Promise<MessageSuccessResponse<LoginMessageData>> {
    const paramsFromMessage = messageParams.split(';');

    if (
      paramsFromMessage.length === 2 &&
      paramsFromMessage[0] &&
      paramsFromMessage[1]
    ) {
      const loginMessageData: LoginMessageData = {
        imei: paramsFromMessage[0],
        password: paramsFromMessage[1],
      };
      return {
        data: loginMessageData,
        response: this.generateMessageResponse(),
      };
    } else {
      throw new BadLoginMessage();
    }
  }

  generateMessageResponse() {
    return `#${this.responseType}#1\r\n`;
  }
}
