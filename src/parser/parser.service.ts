import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TerminalCodes } from 'src/enums/terminal-codes.enum';
import { BadRequestException } from 'src/http-exceptions/errors-for-terminal/bad-request.error';
import { MessagesService } from 'src/messages/messages.service';
import { PointsModel } from 'src/points/points.model';
import { StorageService } from 'src/storage/storage.service';
import { TerminalsModel } from 'src/terminals/terminals.model';

@Injectable()
export class ParserService {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly storageService: StorageService,
    @InjectModel('points')
    private readonly pointsModel: Model<PointsModel>,
    @InjectModel('terminals')
    private readonly terminalsModel: Model<TerminalsModel>,
  ) {}

  async parseMessage(message: string, terminalRemoteAddress: string) {
    const { messageType, messageBody } = this.getMessageData(message);

    const parseResult = await this.messagesService.parseMessage(
      messageType,
      messageBody,
    );

    if (messageType === TerminalCodes.LOGIN_PACKET_REQUEST) {
      await this.storageService.set(
        terminalRemoteAddress,
        parseResult.data.imei,
      );
    } else {
      const imei = await this.storageService.get(terminalRemoteAddress);
      parseResult.data.imei = imei;

      let terminalId: Types.ObjectId;
      if (imei) {
        terminalId = await this.getTeminalId(imei);
      }

      await this.pointsModel.create({
        terminalId,
        ...parseResult.data,
      });
    }

    return parseResult;
  }

  deleteFromStorage(terminalRemoteAddress: string) {
    this.storageService.del(terminalRemoteAddress);
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

  private async getTeminalId(imei: string) {
    const terminalId = await this.terminalsModel.findOne({ imei: imei }).exec();
    return terminalId ? terminalId._id : null;
  }
}
