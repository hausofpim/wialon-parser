import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports, config } from 'winston';
const { combine, timestamp, printf } = format;

@Injectable()
export class FileLoggerService implements LoggerService {
  combinedLogger: Logger;
  errorLogger: Logger;
  constructor() {
    const myFormat = printf(({ level, message, data, timestamp }) => {
      return `${timestamp} ${level} [${message}]: ${
        typeof data === 'object' ? JSON.stringify(data) : data
      }`;
    });

    const loggerFormat = combine(timestamp(), myFormat);

    this.combinedLogger = createLogger({
      level: 'info',
      format: loggerFormat,
      transports: [
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
      ],
    });

    this.errorLogger = createLogger({
      level: 'error',
      format: loggerFormat,
      transports: [
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.combinedLogger.info({
      message: message,
      data: optionalParams,
    });
  }

  error(message: any, ...optionalParams: any[]) {
    this.errorLogger.error({
      message: message,
      data: optionalParams,
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.combinedLogger.warn({
      message: message,
      data: optionalParams,
    });
  }
}
