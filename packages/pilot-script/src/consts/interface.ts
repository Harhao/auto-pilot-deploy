// 服务器密钥和git仓库密钥
export interface IPilotCofig {
    // 服务器IP
    address: string;
    // 用户名
    account: string;
    // 服务器密码
    serverPass: string;
    // git仓库用户名
    gitUser: string;
    // 授权密钥
    gitPass: string;
}
// 项目部署定义
export interface IProjectCofig {
    // git仓库地址
    gitUrl: string;
    // git 分支
    branch: string;
    //构建工具
    tool: string;
    // 构建命令
    command: string;
    // 打包产物目录
    dest: string;
    // 部署类型， node/html静态资源
    type: string;
    // 回退节点commit 或者 git tag
    rollNode?: string;
}

export interface INginxConfig {

    //服务器域名
    apiDomain: string;

    // 接口域名前缀
    apiPrefix?: string;

    //部署服务的本地域名
    apiHost?: string;

    // 部署服务的本地端口号
    apiPort?: number;

}


export interface IDeployConfig {
    pilotCofig: IPilotCofig;
    projectConfig: IProjectCofig;
    nginxConfig: INginxConfig;
}
