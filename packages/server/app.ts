// app.ts
import Koa from 'koa';
import { ServerConfig } from './config'
import { Server } from "http";
import { resolve } from 'path';
import { ControllerLoader, MiddlewareLoader } from './utils';
import { MongoDBService, RedisService, SocketService } from './service';

export default class App {

  private readonly app: Koa;
  private readonly port: number;
  private socketServer: Server ;

  constructor() {
    this.app = new Koa();
    this.port = ServerConfig.port;

    MiddlewareLoader.load(this.app);
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

    const socketService = new SocketService(this.app.callback());
    this.socketServer = socketService.getSocketServer();

    this.app.context.state.services = {
      ...this.app.context.state,
      socketService: socketService
    }
  }

  async initDBHandle() {

    const mongodbService = await this.getMongoInstance();
    const redisService = await this.getRedisInstance();


    this.app.context.state = {
      ...this.app.context.state,
        mongodbService,
        redisService, 
    };
  }

  async beforeBootstrap(): Promise<void> {

    await this.initDBHandle();
    await this.initSocketHandle();
  }

  async start(): Promise<void> {

    await this.beforeBootstrap();

    this.socketServer.listen(this.port, () => {
      console.log(`服务器启动成功，端口监听在 ${this.port}`);
    });

  }
}
