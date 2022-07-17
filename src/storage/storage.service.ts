import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class StorageService {
  redisClient: RedisClientType;
  constructor() {
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
    this.redisClient = createClient({
      url: 'redis://default:redispw@localhost:49153',
    });
    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    await this.redisClient.connect();
  }
}
