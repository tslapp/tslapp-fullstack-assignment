import * as cors from 'cors';
import * as express from 'express';
import { createServer, Server } from 'http';
import { HttpError, useExpressServer } from 'routing-controllers';
import { APPLICATION_NAME, ENV, PORT } from './constant';

export interface HttpServerOptions {
  port: number;
  application: string;
  controllers: string[];
}

const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.info(`Receiving ${req.method} request ${req.path}`);
  next();
};

export async function initializeHttpServer(options: HttpServerOptions): Promise<Server> {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(requestLogger);

  const server = createServer(useExpressServer(app, {
    controllers: options.controllers,
    defaultErrorHandler: false,
  }));

  // health check
  app.get('/', (req, res) => {
    res.status(200).json({
      application: APPLICATION_NAME,
      env: ENV,
    });
  });

  // error handler
  app.use((err: Error | HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    if ('httpCode' in err) {
      res.status(err.httpCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'internal_server_error' : err.message });
    }
    next();
  });

  return new Promise((resolve => {
    server.listen(PORT, () => {
      console.info(`Http server is running on http://localhost:${PORT}`);
      resolve(server);
    });
  }));
}
