import { Injectable } from '@nestjs/common';
import { TerminalCodes } from 'src/enums/terminal-codes.enum';
import { BadRequestException } from 'src/http-exceptions/errors-for-terminal/bad-request.error';
import { MessagesService } from 'src/messages/messages.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ParserService {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly storageService: StorageService,
  ) {}

  async parseMessage(message: string, terminalId: string) {
    const { messageType, messageBody } = this.getMessageData(message);

    const parseResult = await this.messagesService.parseMessage(
      messageType,
      messageBody,
    );

    if (messageType === TerminalCodes.LOGIN_PACKET_REQUEST) {
      await this.storageService.set(terminalId, parseResult.data.imei);
    } else {
      const imei = await this.storageService.get(terminalId);
      parseResult.data.imei = imei;
    }

    return parseResult;
  }

  deleteFromStorage(terminalId: string) {
    this.storageService.del(terminalId);
  }

  private getMessageData(message: string) {
    const validateReqExp = /^#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)\\r\\n/g;

    let messageType: string, messageBody: string;
    try {
      const validate = [...message.matchAll(validateReqExp)];
      messageType = validate[0]['groups']['type'];
      messageBody = validate[0]['groups']['message'];
    } catch (error) {
      throw new BadRequestException();
    }

    return {
      messageType,
      messageBody,
    };
  }
}
