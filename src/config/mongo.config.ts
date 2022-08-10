import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoDbConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
  uri: `mongodb://${configService.get('MONGO_USERNAME')}:${configService.get(
    'MONGO_PASSWORD',
  )}@mongo:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DB')}`,
});
