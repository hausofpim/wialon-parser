import { Controller, Post, Req, UseFilters } from '@nestjs/common';
import { Request } from 'express';
import * as rawbody from 'raw-body';
import { BadRequestException } from 'src/http-exceptions/errors-for-terminal/bad-request.error';
import { HttpExceptionFilter } from '../http-exceptions/http-exception.filter';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async index(@Req() req: Request) {
    let text: string;
    if (req.readable) {
      const raw = await rawbody(req);
      text = raw.toString().trim();
    } else {
      throw new BadRequestException();
    }

    return await this.parserService.parseMessage(text);
  }
}
