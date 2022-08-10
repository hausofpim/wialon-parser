/* eslint-disable @typescript-eslint/no-var-requires */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileLoggerModule } from './file-logger/file-logger.module';
import { FileLoggerService } from './file-logger/file-logger.service';
import { CustomHttpException } from './http-exceptions/custom-http.exception';
import { ParserModule } from './parser/parser.module';
import { ParserService } from './parser/parser.service';
const net = require('net');

async function bootstrap() {
  const { paserService, configService, fileLoggerService } =
    await createStandaloneServices();

  const tcpServer = net.createServer();
  tcpServer.on('connection', (connection) => {
    connection.setEncoding('utf-8');
    connection.setNoDelay(true);
    const remoteAddress = `${connection.remoteAddress}:${connection.remotePort}`;
    let message = '';

    connection.on('data', (data: string) => {
      if (!paserService.checkMessageEnd(data)) {
        message = `${message}${data}`;
        fileLoggerService.log(
          'Requested message`s part, check for the messages end',
        );
      } else {
        const fullmessage = `${message}${data}`;
        message = '';
        fileLoggerService.log(
          'Requested full message, start parsing',
          fullmessage,
        );
        new Promise<any>((resolve) => {
          const res = paserService.parseMessage(fullmessage, remoteAddress);
          resolve(res);
        })
          .then((res) => {
            connection.write(res.response);
          })
          .catch((error) => {
            if (error instanceof CustomHttpException) {
              const errorData = error.getResponse();
              fileLoggerService.error(
                `CustomHttpException:: Parsing message error`,
                errorData,
                error,
                data,
              );
              connection.write(
                `#${errorData.messageType}#${errorData.errorNumber}\r\n`,
              );
            } else {
              fileLoggerService.error(
                `Internal:: Parsing message error`,
                error,
              );
              connection.write(`##-1\r\n`);
            }
          });
      }
    });

    connection.once('close', () => {
      paserService.deleteFromStorage(remoteAddress);
      fileLoggerService.log('Connection close', remoteAddress);
    });

    connection.on('error', (error) => {
      fileLoggerService.log('Connection error', error);
    });

    fileLoggerService.log('New client connection', remoteAddress);
  });

  const tcpServerPort = configService.get('TCP_PORT');
  const tcpServerHost = configService.get('TCP_HOST');
  tcpServer.listen(tcpServerPort, tcpServerHost, function () {
    fileLoggerService.log('Server listening', tcpServer.address());
  });
}

async function createStandaloneServices() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: new FileLoggerService(),
  });

  const paserService = app
    .select(ParserModule)
    .get(ParserService, { strict: true });

  const configService = app
    .select(ConfigModule)
    .get(ConfigService, { strict: true });

  const fileLoggerService = app
    .select(FileLoggerModule)
    .get(FileLoggerService, { strict: true });

  return { paserService, configService, fileLoggerService };
}

bootstrap();
