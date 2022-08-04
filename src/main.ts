/* eslint-disable @typescript-eslint/no-var-requires */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomHttpException } from './http-exceptions/custom-http.exception';
import { ParserModule } from './parser/parser.module';
import { ParserService } from './parser/parser.service';
const net = require('net');

async function bootstrap() {
  const { paserService, configService } = await createStandaloneServices();

  const tcpServer = net.createServer();
  tcpServer.on('connection', (connection) => {
    connection.setEncoding('utf-8');
    connection.setNoDelay(true);
    const remoteAddress = `${connection.remoteAddress}:${connection.remotePort}`;
    let message: string = '';

    connection.on('data', (data: string) => {
      console.log('new data', data);
      if (!paserService.checkMessageEnd(data)) {
        message = `${message}${data}`;
        console.log('check for the messages end');
      } else {
        console.log('requested full message! start parsing');
	const fullmessage = `${message}${data}`;
	message = '';
        new Promise<any>((resolve) => {
          const res = paserService.parseMessage(fullmessage, remoteAddress);
          resolve(res);
        })
          .then((res) => {
            connection.write(res.response);
          })
          .catch((error) => {
            if (error instanceof CustomHttpException) {
              console.log(error, data);
              const errorData = error.getResponse();
              console.log(
                `CustomHttpException:: Parsing message error:`,
                errorData,
              );
              connection.write(
                `#${errorData.messageType}#${errorData.errorNumber}\r\n`,
              );
            } else {
              console.log(`Parsing message error:`, error);
              connection.write(`##-1\r\n`);
            }
          });
      }
    });

    connection.once('close', () => {
      paserService.deleteFromStorage(remoteAddress);
      console.log('connection close');
    });

    connection.on('error', (error) => {
      console.log('connection error', error);
    });

    console.log('new client connection from %s', remoteAddress);
  });

  const tcpServerPort = configService.get('TCP_PORT');
  const tcpServerHost = configService.get('TCP_HOST');
  tcpServer.listen(tcpServerPort, tcpServerHost, function () {
    console.log('server listening to %j', tcpServer.address());
  });
}

async function createStandaloneServices() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const paserService = app
    .select(ParserModule)
    .get(ParserService, { strict: true });

  const configService = app
    .select(ConfigModule)
    .get(ConfigService, { strict: true });

  return { paserService, configService };
}

bootstrap();
