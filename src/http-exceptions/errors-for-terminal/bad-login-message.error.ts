import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { CustomHttpException } from '../custom-http.exception';

export class BadLoginMessage extends CustomHttpException {
  constructor() {
    super(
      CustomHttpException.createBody(TerminalCodes.LOGIN_PACKET_RESPONSE, 0),
      400,
    );
  }
}
