/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomHttpException } from './http-exceptions/custom-http.exception';
import { ParserModule } from './parser/parser.module';
import { ParserService } from './parser/parser.service';
const net = require('net');

async function bootstrap() {
  const paserService = await createStandaloneParserApp();

  const tcpServer = net.createServer();
  tcpServer.on('connection', (connection) => {
    connection.setEncoding('utf-8');
    connection.setNoDelay(true);
    const remoteAddress = `${connection.remoteAddress}:${connection.remotePort}`;

    connection.on('data', (data: string) => {
      new Promise<any>((resolve) => {
        const res = paserService.parseMessage(data, remoteAddress);
        resolve(res);
      })
        .then((res) => {
          connection.write(res.response);
        })
        .catch((error) => {
          if (error instanceof CustomHttpException) {
            const errorData = error.getResponse();
            console.log(
              `CustomHttpException:: Parsing message error:`,
              errorData,
            );
            connection.write(
              `#${errorData.messageType}#${errorData.errorNumber}\\r\\n`,
            );
          } else {
            console.log(`Parsing message error:`, error);
            connection.write('##-1\\r\\n');
          }
        });
    });

    connection.once('close', () => {
      paserService.deleteFromStorage(remoteAddress);
      console.log('connection close');
    });

    connection.on('error', (error) => {
      console.log('connection error');
    });

    console.log('new client connection from %s', remoteAddress);
  });

  tcpServer.listen(555, 'localhost', function () {
    console.log('server listening to %j', tcpServer.address());
  });
}

async function createStandaloneParserApp() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app
    .select(ParserModule)
    .get(ParserService, { strict: true });

  return tasksService;
}

bootstrap();
