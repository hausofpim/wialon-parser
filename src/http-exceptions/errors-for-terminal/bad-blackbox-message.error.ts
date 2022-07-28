import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { CustomHttpException } from '../custom-http.exception';

export class BadBlackboxMessage extends CustomHttpException {
  constructor() {
    super(
      CustomHttpException.createBody(TerminalCodes.BLACKBOX_PACKET_RESPONSE, 0),
      400,
    );
  }
}
