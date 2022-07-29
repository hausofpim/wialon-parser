import { BadShortDataMessage } from 'src/http-exceptions/errors-for-terminal/bad-short-data-message.error';
import { ShortDataType } from 'src/types/message-data-types/short-data.type';
import { MessageSuccessResponse } from 'src/types/message-success-response.type';
import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { Message } from './message.class';

export class ShortDataMessage extends Message {
  messageType = TerminalCodes.SHORT_DATA_PACKET_REQUEST;
  responseType = TerminalCodes.SHORT_DATA_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(
    messageParams: string,
  ): Promise<MessageSuccessResponse<ShortDataType>> {
    const paramsFromMessage = messageParams.split(';');
    if (
      paramsFromMessage.length === 10 &&
      paramsFromMessage.every((param) => param)
    ) {
      return {
        data: ShortDataMessage.getShortData(paramsFromMessage),
        response: this.generateMessageResponse(),
      };
    } else {
      throw new BadShortDataMessage();
    }
  }

  static getShortData(params: string[]): ShortDataType {
    const onlyShortData = params.slice(0, 10);
    return {
      date: onlyShortData[0],
      time: onlyShortData[1],
      lat1: onlyShortData[2],
      lat2: onlyShortData[3],
      lon1: onlyShortData[4],
      lon2: onlyShortData[5],
      speed: onlyShortData[6],
      course: onlyShortData[7],
      height: onlyShortData[8],
      sats: onlyShortData[9],
    };
  }

  generateMessageResponse() {
    return `#${this.responseType}#1\r\n`;
  }
}
