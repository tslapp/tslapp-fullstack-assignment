import * as path from 'path';
import { APPLICATION_NAME, LOG_LEVEL, PORT } from './constant';
import * as config from '../resource/config.json';
import { DbOptions } from './db';
import { HttpServerOptions } from './http';

export const dbOptions: DbOptions = {
  url: config.db.url,
  logging: LOG_LEVEL === 'debug',
  entities: [path.resolve(__dirname, '../entity/*.js')],
  migrations: [path.resolve(__dirname, '../migration/*.js')],
};

export const httpOptions: HttpServerOptions = {
  port: Number(PORT),
  controllers: [path.resolve(__dirname, `../controller/*.js`)],
  application: APPLICATION_NAME,
};

export { config };
