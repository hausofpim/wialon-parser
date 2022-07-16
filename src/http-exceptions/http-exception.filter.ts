import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseForTerminal } from 'src/types/error-response-for-terminal.type';
import { CustomHttpException } from '../http-exceptions/custom-http.exception';

@Catch(CustomHttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorObject: ErrorResponseForTerminal = exception.getResponse();

    response
      .status(status)
      .send(`#${errorObject.messageType}#${errorObject.errorNumber}\\r\\n`);
  }
}
