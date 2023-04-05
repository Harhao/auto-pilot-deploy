import { PromptObject } from "prompts";

const commonStyle = {
    lineHeight: 2
};

const deployConfig: PromptObject[] = [
    {
        type: 'text',
        name: 'address',
        message: '✨需要部署的服务器地址✨~',
    },
    {
        type: 'text',
        name: 'serverPass',
        style: "password",
        message: '✨需要部署服务器密码✨'
    },
    {
        type: 'text',
        name: 'gitPass',
        style: "password",
        message: '✨需要部署的git仓库个人令牌✨'
    },
];

const projectConfig: any[] = [
    {
        type: "text",
        name: "gitUrl",
        message: "",
        onRender(kleur: any) {
            this.msg = kleur.green("输入需要部署的git仓库地址");
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
            { title: 'npm', value: 'npm' },
            { title: 'yarn', value: 'yarn' },
            { title: 'pnpm', value: 'pnpm' }
        ]
    },
    {
        type: "text",
        name: "command",
        message: "输入需要构建脚本",
    },
    {
        type: "text",
        name: "dest",
        message: "输入需要构建脚本文件夹",
    },
];

export { deployConfig, projectConfig };