# 项目发布部署平台

[![pilot-deploy](https://github.com/Harhao/auto-pilot-deploy/actions/workflows/normal-build.yml/badge.svg)](https://github.com/Harhao/auto-pilot-deploy/actions/workflows/normal-build.yml)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

> pilot-deploy 是一个前端部署平台，用作前端静态资源和 Nodejs 的服务部署（⚠️ 目前阶段不支持 docker 的类型的部署，docker 部署是类似于方式，可以进一步扩展）；

## 项目结构

项目是基于 pnpm 的 monorepo 多项目结构，具体包括:

- client: 前端后台管理系统（基于 React 技术栈）
- server: Node.js 开发服务端接口项目（包括回滚和部署，nodejs 服务的暂停和恢复）
- pilot-script 部署项目的脚本 cli

```
├── LICENSE
├── README.md
├── docker-compose.yml
├── package.json
├── packages
│   ├── client
│   ├── pilot-script
│   └── server
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## 环境配置

### 服务部署环境

server 项目需要依赖 Redis 和 Mongodb 的数据库环境，如果没有线上的数据库环境，可以使用 Redis 和 Mongodb 的 docker 镜像来替换

```js
# 监听端口
PORT=6254 // 服务监听端口

# JWT加密秘钥
JWT_SECRET= xxxxxx // JWT 随机串（salt）
CRYPTORANDOM= xxxx // 对称加密随机串（salt）

# 数据库地址
DATABASE_NAME=xxxx // mongodb数据库名称
DATABASE_URL=xxxx // mongodb数据库url

# redis数据库
REDISHOST=xxxxxx // redis数据库url
REDISPORT=xxxxx  // redis数据库端口
REDISPASS=xxxx // redis数据库密码
REDISPREFIX=xxxx // redis数据库使用前缀
REDISPIDMAP=xxxx //服务部署进程hashMap
```

### 部署目标服务器部署环境

github 仓库项目需要部署到服务器，需要配置服务器的权限设置和 github 仓库的读写权限

```bash
    "address" : "", // 服务器IP
    "account" : "", // 服务器用户名
    "serverPass" : "", // 服务器密码
    "gitUser" : "", // github仓库用户名
    "gitPass" : "", // github授权码，类似“ghp_xxx”开头，可以在github setting用到
    "env" : "prod"// 发布环境
```

部署服务环境需要 nginx/pm2 依赖，<br/>
可以根据系统安装 nginx

```bash
#ubuntu安装nginx
$ sudo apt install nginx

#centos安装nginx
$ sudo yum install epel-release
$ sudo yum install nginx
```

安装 pm2,pm2 依赖 npm 包工具

```bash
# ubuntu 安装pm2
$ sudo apt install nodejs
$ npm install pm2 -g

# centos 安装pm2
$ sudo yum install -y nodejs
$ npm install pm2 -g

```

## 使用方式

### 安装项目依赖

```bash
pnpm install
```

### 运行前端项目

```bash
npm run start:client
```

### 运行 server 项目:

进入 packages/server 项目中，把 pilot-script 命令行脚本 link 到 server 依赖中

```bash
pnpnm link ../pilot-script
```

在根项目目录下运行

```bash
npm run start:server
```

或者在 server 项目中运行

```bash
npm run start
```

### 运行效果

![运行校服哦](https://qiniu.oss-storage.top/auto-pilot/1685629569926.jpg)
