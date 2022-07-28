import { TerminalCodes } from '../../enums/terminal-codes.enum';
import { CustomHttpException } from '../custom-http.exception';

export class BadShortDataMessage extends CustomHttpException {
  constructor() {
    super(
      CustomHttpException.createBody(
        TerminalCodes.SHORT_DATA_PACKET_RESPONSE,
        0,
      ),
      400,
    );
  }
}
