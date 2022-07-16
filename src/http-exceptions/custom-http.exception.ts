import { ErrorResponseForTerminal } from 'src/types/error-response-for-terminal.type';

export class CustomHttpException extends Error {
  private readonly response: ErrorResponseForTerminal;
  private readonly status: number;

  constructor(response: ErrorResponseForTerminal, status: number) {
    super();
    this.response = response;
    this.status = status;
  }
  cause: Error | undefined;

  getResponse(): ErrorResponseForTerminal {
    return this.response;
  }

  getStatus(): number {
    return this.status;
  }

  static createBody(
    messageType: string,
    errorNumber: number,
  ): ErrorResponseForTerminal {
    return {
      messageType,
      errorNumber,
    };
  }
}
