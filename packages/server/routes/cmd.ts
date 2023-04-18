import Router from 'koa-router';
import Auth from '../utils/auth';
import { cmdController } from '../controller/cmd';

const cmdRouter = new Router({ prefix: '/cmd' });
const authMiddleWare = Auth.verifyUserToken();

// 部署项目
cmdRouter.get('/deploy', cmdController.deploy);
// 回滚项目
cmdRouter.post('/rollback', cmdController.rollback);
//停止运行
cmdRouter.post('/stop', cmdController.stopRun);
// 获取服务
cmdRouter.get('/service', cmdController.getServices);

export default cmdRouter;
