import 'reflect-metadata';
import { dbOptions, httpOptions } from './component/config';
import { initializeDb } from './component/db';
import { initializeHttpServer } from './component/http';

(async () => {
  await initializeDb(dbOptions);
  await initializeHttpServer(httpOptions);
})();
