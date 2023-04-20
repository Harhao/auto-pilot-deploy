// app.ts
import Koa from 'koa';
import cors from 'koa2-cors';
import error from 'koa-json-error';
import helmet from 'koa-helmet';
import http from 'http';
import { ControllerLoader, logger, bodyParser, postFormat } from './utils';
import { resolve } from 'path';
import { Server, Socket } from 'socket.io';
import { MongoDBService, RedisService } from './service';

interface AppConfig {
  port: number;
  corsOptions?: cors.Options;
}

export default class App {

  private readonly config: AppConfig;
  private readonly app: Koa;
  private server: http.Server;
  private io: Server;

  constructor(config: AppConfig) {
    this.config = config;
    this.app = new Koa();

    // 应用安全，防止xss， csrf
    this.app.use(helmet());
    // 防止生产环境打印stack信息
    this.app.use(error({ postFormat }));
    this.app.use(cors(this.config.corsOptions));
    this.app.use(logger);
    this.app.use(bodyParser);

    ControllerLoader.load(this.app, resolve(__dirname, './controller'));
  }

  async getMongoInstance() {
    const mongoClient = new MongoDBService();
    await mongoClient.connect();
    return mongoClient;
  }

  async getRedisInstance() {
    const redisClient = new RedisService({ prefix: 'autopilot' });
    await redisClient.connect();
    return redisClient;
  }

  async initSocketHandle() {
    this.server = http.createServer(this.app.callback());
    this.io = new Server(this.server, {
      cors: {
        origin: '*'
      },
    });
    this.io.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
      socket.on('chatMessage', (msg: string) => {
        console.log(`chatMessage: ${msg}`);
      });
    });

    this.app.context.state = {
      ...this.app.context.state,
      socket: this.io
    }
  }

  async initDBHandle() {
    
    const mongodbService = await this.getMongoInstance();
    const redisService = await this.getRedisInstance();

    this.app.context.state = {
      ...this.app.context.state,
      services: {
        mongodbService,
        redisService,
      }
    };
  }

  async initMiddleWares() {
    
  }

  async beforeBootstrap(): Promise<void> {
    await this.initSocketHandle();
    await this.initDBHandle();
    await this.initMiddleWares();

  }

  async start(): Promise<void> {

    await this.beforeBootstrap();

    this.server.listen(this.config.port, () => {
      console.log(`服务器启动成功，端口监听在 ${this.config.port}`);
    });

  }
}
