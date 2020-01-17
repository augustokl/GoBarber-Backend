import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.execptionHandlers();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(Sentry.Handlers.errorHandler());
    this.server.use(routes);
  }

  execptionHandlers() {
    this.server.user(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      res.status(500).json(errors);
    });
  }
}

export default new App().server;
