import { Context } from 'koa';
import Joi from 'joi';

class CmdController {
    async deploy(ctx: Context) {
        const shcema = Joi.object({
            title: Joi.string().required(),
            isHot: Joi.boolean()
          });
    }
}

const cmdController = new CmdController();
export { cmdController }; 
