import Router from 'koa-router';
import Auth from '../utils/auth';
import { cmdController } from '../controller/cmd';

const cmdRouter = new Router({ prefix: '/cmd' });
const authMiddleWare = Auth.verifyUserToken();

// 部署项目
cmdRouter.post('/deploy', authMiddleWare, cmdController.deploy);
// 回滚项目
cmdRouter.post('/rollback', authMiddleWare, cmdController.rollback);
//停止运行
cmdRouter.post('/stop', authMiddleWare, cmdController.stopRun);

export default cmdRouter;
