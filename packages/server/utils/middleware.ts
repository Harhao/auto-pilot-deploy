import koaLog4 from 'koa-log4';
import body from 'koa-body';
import cors from 'koa2-cors';
import log4js from 'log4js';
import log4jsJson from '../log4js.json';

export interface ErrorType {
  name: string
  status: number
  message: string
  stack: string
}

const initLogger = () => {
  log4js.configure(log4jsJson);
  const logger = log4js.getLogger();
  return koaLog4.koaLogger(logger, { level: 'auto'});
};

export const logger = initLogger();

export const bodyParser = body({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024,
  },
});

export const postFormat = (err: Error, data: ErrorType) => {
  const errorStack =
    process.env.NODE_ENV === 'prod'
      ? {
          ...data,
          stack: null,
        }
      : data;
  return errorStack;
};

export const corsOptions: cors.Options = {
  origin: '*',
  maxAge: 5,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};
