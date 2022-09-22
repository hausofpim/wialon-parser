import { BadDataMessage } from 'src/http-exceptions/errors-for-terminal/bad-data-message.error';
import { DataType } from 'src/types/message-data-types/data.type';
import { MessageSuccessResponse } from 'src/types/message-success-response.type';
import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { Message } from './message.class';
import { ShortDataMessage } from './short-data.class';

export class DataMessage extends Message {
  messageType = TerminalCodes.DATA_PACKET_REQUEST;
  responseType = TerminalCodes.DATA_PACKET_RESPONSE;
  messageParams: string;

  async parseMessage(
    messageParams: string,
  ): Promise<MessageSuccessResponse<DataType>> {
    const paramsFromMessage = messageParams.split(';');
    if (paramsFromMessage.length === 16) {
      const shortDataPart = ShortDataMessage.getShortData(paramsFromMessage);
      const inputsDataPart = DataMessage.getInputsData(paramsFromMessage);
      console.log('inputsDataPart', inputsDataPart);
      return {
        data: {
          ...shortDataPart,
          ...inputsDataPart,
        },
        response: this.generateMessageResponse(),
      };
    } else {
      throw new BadDataMessage();
    }
  }

  static getInputsData(params: string[]) {
    const onlyInputsData = params.slice(10, 16);

    return {
      hdop: onlyInputsData[0],
      inputs: DataMessage.reverseBinaryArray(onlyInputsData[1]),
      outputs: DataMessage.reverseBinaryArray(onlyInputsData[2]),
      adc: onlyInputsData[3].split(',').map((el) => parseFloat(el)),
      ibutton: onlyInputsData[4],
      params: this.generateParamsObject(onlyInputsData[5]),
    };
  }

  private static reverseBinaryArray(stringOfInt) {
    return Number(stringOfInt)
      .toString(2)
      .split('')
      .reverse()
      .map((el) => parseInt(el));
  }

  private static generateParamsObject(paramsString: string) {
    const paramsObject = {};

    const test = paramsString.split(',');
    test.forEach((el) => {
      const splitedParam = el.split(':');
      switch (splitedParam[1]) {
        case '1':
          paramsObject[splitedParam[0]] = parseInt(splitedParam[2]);
          break;
        case '2':
          paramsObject[splitedParam[0]] = parseFloat(splitedParam[2]);
          break;
        default:
          paramsObject[splitedParam[0]] = splitedParam[2];
          break;
      }
    });

    return paramsObject;
  }

  generateMessageResponse() {
    return `#${this.responseType}#1\r\n`;
  }
}
