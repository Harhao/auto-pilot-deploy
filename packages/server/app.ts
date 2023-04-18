import Koa from 'koa';
import cors from 'koa2-cors';
import error from 'koa-json-error';
import helmet from 'koa-helmet';
import config from './config/config';
import userRouter from './routes/user';
import commonRouter from './routes/common';
import cmdRouter from './routes/cmd';
import { connectToDB, connectToRedis } from './config/db';
import { logger, bodyParser, postFormat, corsOptions } from './utils/middleware';
import { runTask } from './utils/tools';
import { Server } from 'socket.io';
import http from 'http';

try {
  // connectToDB(
  //   () => {
      const app = new Koa();
      const server = http.createServer(app.callback());
      const io = new Server(server, {
        cors: {
          origin: '*',
        }
      });

      // 应用安全，防止xss， csrf
      app.use(helmet());
      // 防止生产环境打印stack信息
      app.use(error({ postFormat }));
      app.use(cors(corsOptions));
      app.use(logger);
      app.use(bodyParser);

      

      io.on('connection', (socket) => {
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
        socket.on('chatMessage', (msg) => {
          console.log('doing');
        });
      });  

      server.listen(config.port, () => {
        console.log(`服务器启动成功，端口监听在 ${config.port}`);
      });
      
      app.context.webSocket = io;   
      app.context.redisClient = connectToRedis();

      runTask(app.context.redisClient);
    // },
    // (error: Error) => {
    //   throw error;
    // }
  // );
} catch (e) {
  console.error('数据库连接异常， 请检查数据库是否可访问');
}

