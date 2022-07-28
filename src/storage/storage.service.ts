import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class StorageService {
  redisClient: RedisClientType;
  constructor(private readonly configService: ConfigService) {
    this.createConnect();
  }

  async set(key, value) {
    await this.redisClient.set(key, value);
  }

  async get(key) {
    return await this.redisClient.get(key);
  }

  async del(key) {
    await this.redisClient.del(key);
  }

  private async createConnect() {
    const redisHost = this.configService.getOrThrow('REDIS_HOST');
    const redisPort = this.configService.getOrThrow('REDIS_PORT');

    this.redisClient = createClient({
      url: `redis://${redisHost}:${redisPort}/`,
    });

    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    await this.redisClient.connect();
  }
}
