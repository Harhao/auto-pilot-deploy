// app.ts
import Koa from 'koa';
import cors from 'koa2-cors';
import error from 'koa-json-error';
import helmet from 'koa-helmet';
import http from 'http';
import { ControllerLoader, logger, bodyParser, postFormat } from './utils';
import { resolve } from 'path';
import { Server, Socket } from 'socket.io';

interface AppConfig {
  port: number;
  corsOptions?: cors.Options;
}

export default class App {

  private readonly config: AppConfig;
  private readonly app: Koa;
  private readonly server: http.Server;
  private readonly io: Server;

  constructor(config: AppConfig) {
    this.config = config;
    this.app = new Koa();
    this.server = http.createServer(this.app.callback());
    this.io = new Server(this.server, {
      cors: {
        origin: '*'
      },
    });

    // 应用安全，防止xss， csrf
    this.app.use(helmet());
    // 防止生产环境打印stack信息
    this.app.use(error({ postFormat }));
    this.app.use(cors(this.config.corsOptions));
    this.app.use(logger);
    this.app.use(bodyParser);

    ControllerLoader.load(this.app, resolve(__dirname, './controller'));

    this.io.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
      socket.on('chatMessage', (msg: string) => {
        console.log(`chatMessage: ${msg}`);
      });
    });
  }

  start(): void {
    this.server.listen(this.config.port, () => {
      console.log(`服务器启动成功，端口监听在 ${this.config.port}`);
    });

    this.app.context.webSocket = this.io;
  }
}
