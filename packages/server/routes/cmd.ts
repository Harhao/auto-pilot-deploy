import Router from 'koa-router';
import Auth from '../utils/auth';
import { cmdController } from '../controller/cmd';

const cmdRouter = new Router({ prefix: '/cmd' });
const authMiddleWare = Auth.verifyUserToken();

cmdRouter.post('/deploy', authMiddleWare, cmdController.deploy);

export default cmdRouter;
