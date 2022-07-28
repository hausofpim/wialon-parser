import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { CustomHttpException } from '../custom-http.exception';

export class BadDataMessage extends CustomHttpException {
  constructor() {
    super(
      CustomHttpException.createBody(TerminalCodes.DATA_PACKET_RESPONSE, 0),
      400,
    );
  }
}
