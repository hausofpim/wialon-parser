import { Injectable } from '@nestjs/common';
import { BadRequestException } from 'src/http-exceptions/errors-for-terminal/bad-request.error';

@Injectable()
export class ParserService {
  async parseMessage(message: string) {
    const validateReqExp = /^#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)\\r\\n/g;

    let messageType: string, messageBody: string;
    try {
      const validate = [...message.matchAll(validateReqExp)];
      messageType = validate[0]['groups']['type'];
      messageBody = validate[0]['groups']['message'];
    } catch (error) {
      throw new BadRequestException();
    }

    return `${messageType} ${messageBody}`;
  }
}
