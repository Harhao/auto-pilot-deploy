import { EProjectType } from "../consts";
import prompts from "prompts";

type promptType = prompts.PromptObject & {
    msg?: string;
};

const isFrontEndType = (answer: Record<string, unknown>) => {
    return answer?.type === EProjectType.FRONTEND;
}

export const deployConfig: promptType[]  = [
    {
        type: 'text',
        name: 'address',
        message: '✨需要部署的服务器地址✨~',
        onRender(kleur: any) {
            this.msg = kleur.green("✨需要部署的服务器地址✨");
        }
    },
    {
        type: 'text',
        name: 'account',
        message: '✨登录服务器的账号✨~',
        onRender(kleur: any) {
            this.msg = kleur.yellow("✨登录服务器的账号✨");
        }
    },
    {
        type: 'text',
        name: 'serverPass',
        style: "password",
        message: '✨需要部署服务器密码✨',
        onRender(kleur: any) {
            this.msg = kleur.yellow("需要部署服务器密码✨");
        }
    },
    {
        type: 'text',
        name: 'gitUser',
        message: '✨需要部署的git仓库账号✨',
        onRender(kleur: any) {
            this.msg = kleur.green("✨需要部署的git仓库账号✨");
        }
    },
    {
        type: 'text',
        name: 'gitPass',
        style: "password",
        message: '✨需要部署的git仓库个人令牌✨',
        onRender(kleur: any) {
            this.msg = kleur.green("✨需要部署的git仓库个人令牌✨");
        }
    }
];

export const projectConfig: promptType[] = [
    {
        type: "text",
        name: "gitUrl",
        message: "",
        onRender(kleur: any) {
            this.msg = kleur.green("输入git仓库地址");
        }
    },
    {
        type: "text",
        name: "branch",
        message: "输入需要构建的git分支",
    },
    {
        type: 'autocomplete',
        name: 'tool',
        message: '请选择构建的工具',
        choices: [
            { title: 'yarn', value: 'yarn' },
            { title: 'npm', value: 'npm' },
            { title: 'pnpm', value: 'pnpm' }
        ],
        onRender(kleur: any) {
            this.msg = kleur.green("请选择构建的工具");
        }
    },
    {
        type: 'autocomplete',
        name: 'type',
        message: '请选择项目类型',
        choices: [
            { title: '前端项目', value: 'frontEnd' },
            { title: 'node服务', value: 'backEnd' },
        ],
        onRender(kleur: any) {
            this.msg = kleur.green("请选择项目类型");
        }
    },
    {
        type: "text",
        name: "command",
        message: "输入需要构建脚本",
        onRender(kleur: any) {
            this.msg = kleur.green("输入需要构建脚本");
        }
    },
    {
        type: (_, answer) => isFrontEndType(answer) ? 'text' : null,
        name: "dest",
        message: "输入需要发布的文件",
        initial: '',
        onRender(kleur: any) {
            this.msg = kleur.green("输入需要发布的文件");
        }
    },
    {
        type: (_, answer) => !isFrontEndType(answer) ? 'text' : null,
        name: "deploy",
        message: "",
        initial: '',
        onRender(kleur: any) {
            this.msg = kleur.green("输入服务发布的构建脚本");
        }
    },
];


export const nginxConfig: promptType[] = [
    {
        type: "text",
        name: "apiPrefix",
        message: "",
        onRender(kleur: any) {
            this.msg = kleur.green("输入需要服务的前缀名");
        }
    },
    {
        type: "text",
        name: "apiHost",
        message: "",
        initial: "http://127.0.0.1",
        onRender(kleur: any) {
            this.msg = kleur.green("输入需要服务的地址");
        }
    },
    {
        type: 'number',
        name: 'apiPort',
        message: '',
        onRender(kleur: any) {
            this.msg = kleur.green("请输入需要服务的端口号");
        }
    },
];


export const rollBackConfig:promptType[] = [
    {
        type: "text",
        name: "rollNode",
        message: "",
        onRender(kleur: any) {
            this.msg = kleur.green("输入回退的节点(tag/commit)");
        }
    }
];