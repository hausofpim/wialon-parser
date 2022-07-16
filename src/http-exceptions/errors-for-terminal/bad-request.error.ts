import { CustomHttpException } from '../custom-http.exception';

export class BadRequestException extends CustomHttpException {
  constructor() {
    super(CustomHttpException.createBody('', -1), 400);
  }
}
