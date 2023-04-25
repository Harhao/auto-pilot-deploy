// app.ts
import Koa from 'koa';
import MongoDBService from './service/mongo';
import RedisService from './service/redis';
import SocketService from './service/socket';
import container from './ioc/container';

import { ServerConfig } from './config';
import { Server } from 'http';
import { resolve } from 'path';
import { ControllerLoader, MiddlewareLoader } from './utils';

export default class App {

  private readonly app: Koa;
  private readonly port: number;
  private socketServer: Server;

  constructor() {
    this.app = new Koa();
    this.port = ServerConfig.port;
  }

  async getMongoInstance() {
    const mongoClient = new MongoDBService();
    await mongoClient.connect();
    return mongoClient;
  }

  async getRedisInstance() {
    const redisClient = new RedisService();
    await redisClient.connect();
    return redisClient;
  }

  async initSocketHandle() {

    const socketService = new SocketService(this.app.callback());
    this.socketServer = socketService.getSocketServer();

    container.setProvider(SocketService, SocketService);
    container.setInstance(SocketService, socketService);

  }

  async initDBHandle() {

    const mongodbService = await this.getMongoInstance();
    const redisService = await this.getRedisInstance();

    container.setProvider(MongoDBService, MongoDBService);
    container.setInstance(MongoDBService, mongodbService);
    container.setProvider(RedisService, RedisService);
    container.setInstance(RedisService, redisService);

  }

  async beforeBootstrap(): Promise<void> {
    
    await this.initSocketHandle();
    await this.initDBHandle();

    MiddlewareLoader.load(this.app);
    ControllerLoader.load(this.app, resolve(__dirname, './controller'));

  }

  async start(): Promise<void> {

    await this.beforeBootstrap();

    this.socketServer.listen(this.port, () => {
      console.log(`服务器启动成功，端口监听在 ${this.port}`);
    });

    this.socketServer.on("close",() => {
      console.log("执行关闭逻辑")
      const mongodbService = container.getInstance(MongoDBService);
      const redisService = container.getInstance(RedisService);
      const socketService = container.getInstance(SocketService);

      mongodbService.close();
      redisService.close();
      socketService.close();
      
    });
  }
}
