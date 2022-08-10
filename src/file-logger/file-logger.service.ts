import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports, config } from 'winston';
const { combine, timestamp, printf } = format;

@Injectable()
export class FileLoggerService implements LoggerService {
  logger: Logger;
  constructor() {
    const myFormat = printf(({ level, message, data, timestamp }) => {
      return `${timestamp} ${level} [${message}]: ${
        typeof data === 'object' ? JSON.stringify(data) : data
      }`;
    });

    this.logger = createLogger({
      levels: config.syslog.levels,
      level: 'error',
      format: combine(timestamp(), myFormat),
      defaultMeta: { service: 'wialon-parser-service' },
      transports: [
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info({
      message: message,
      data: optionalParams,
    });
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error({
      message: message,
      data: optionalParams,
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn({
      message: message,
      data: optionalParams,
    });
  }
}
