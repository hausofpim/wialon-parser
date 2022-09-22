import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger();
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
      return parseResult;
    }

    const imei: string = await this.getImei(terminalRemoteAddress);
    const terminalId: Types.ObjectId = await this.getTeminalId(imei);

    if (
      messageType === TerminalCodes.SHORT_DATA_PACKET_REQUEST ||
      messageType === TerminalCodes.DATA_PACKET_REQUEST
    ) {
      await this.savePoint(parseResult.data, imei, terminalId);
    } else if (messageType === TerminalCodes.BLACKBOX_PACKET_REQUEST) {
      const pointsToSave = parseResult.data.map((el) =>
        this.savePoint(el, imei, terminalId),
      );
      await Promise.all(pointsToSave);
    }

    return parseResult;
  }

  deleteFromStorage(terminalRemoteAddress: string) {
    this.storageService.del(terminalRemoteAddress);
  }

  checkMessageEnd(message: string) {
    const validateReqExp = /.*(\r\n|\n)/g;
    return validateReqExp.test(message);
  }

  private getMessageData(message: string) {
    const validateReqExp = /^#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)/g;

    let messageType: string, messageBody: string;
    try {
      const validate = [...message.matchAll(validateReqExp)];
      messageType = validate[0]['groups']['type'];
      messageBody = validate[0]['groups']['message'];
    } catch (error) {
      this.logger.error('Message validate error', error);
      throw new BadRequestException();
    }

    return {
      messageType,
      messageBody,
    };
  }

  private async getImei(terminalRemoteAddress: string) {
    return await this.storageService.get(terminalRemoteAddress);
  }

  private async getTeminalId(imei: string) {
    const terminalId = await this.terminalsModel.findOne({ imei: imei }).exec();
    return terminalId ? terminalId._id : null;
  }

  private async savePoint(pointData, imei: string, terminalId: Types.ObjectId) {
    return await this.pointsModel.create({
      imei,
      terminalId,
      ...pointData,
    });
  }
}
