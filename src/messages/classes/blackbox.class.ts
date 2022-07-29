import { BadBlackboxMessage } from 'src/http-exceptions/errors-for-terminal/bad-blackbox-message.error';
import { BlackboxType } from 'src/types/message-data-types/blackbox.type';
import { MessageSuccessResponse } from 'src/types/message-success-response.type';
import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { DataMessage } from './data.class';
import { Message } from './message.class';
import { ShortDataMessage } from './short-data.class';

export class BlackboxMessage extends Message {
  messageType = TerminalCodes.BLACKBOX_PACKET_REQUEST;
  responseType = TerminalCodes.BLACKBOX_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(
    messageParams: string,
  ): Promise<MessageSuccessResponse<BlackboxType>> {
    const parsedMessages = [];
    const paramsFromBlackbox = messageParams.split('|');
    paramsFromBlackbox.forEach((message) => {
      const paramsFromMessage = message.split(';');
      if (paramsFromMessage.length === 16) {
        const shortDataPart = ShortDataMessage.getShortData(paramsFromMessage);
        const inputsDataPart = DataMessage.getInputsData(paramsFromMessage);
        parsedMessages.push({
          ...shortDataPart,
          ...inputsDataPart,
        });
      } else if (paramsFromMessage.length === 10) {
        const shortDataPart = ShortDataMessage.getShortData(paramsFromMessage);
        parsedMessages.push(shortDataPart);
      } else {
        throw new BadBlackboxMessage();
      }
    });

    return {
      data: parsedMessages,
      response: this.generateMessageResponse(parsedMessages.length),
    };
  }

  generateMessageResponse(blackboxMessagesCount) {
    return `#${this.responseType}#${blackboxMessagesCount}\r\n`;
  }
}
