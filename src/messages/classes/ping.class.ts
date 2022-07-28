import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { Message } from './message.class';
import { MessageSuccessResponse } from 'src/types/message-success-response.type';

export class PingMessage extends Message {
  messageType = TerminalCodes.PING_PACKET_REQUEST;
  responseType = TerminalCodes.PING_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(): Promise<MessageSuccessResponse<Record<any, string>>> {
    return {
      data: {},
      response: this.generateMessageResponse(),
    };
  }

  generateMessageResponse() {
    return `#${this.responseType}#\\r\\n`;
  }
}
