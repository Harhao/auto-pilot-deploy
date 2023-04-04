import { PromptObject } from "prompts";
import chalk from "chalk";

const deployConfig: PromptObject[] = [
    {
        type: 'text',
        name: 'address',
        message: '✨需要部署的服务器地址✨~'
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

const projectConfig: PromptObject[] = [
    {
        type: "text",
        name: "gitUrl",
        message: "输入需要部署的git仓库地址",
    },
    {
        type: "text",
        name: "branch",
        message: "输入需要构建的git分支",
    },
    {
        type: "text",
        name: "branch",
        message: "输入需要构建脚本",
    },
    {
        type: "text",
        name: "branch",
        message: "输入需要构建脚本文件夹",
    },
];

export { deployConfig, projectConfig };