# 自动发布部署平台
自动化部署平台


<div align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/15929863/120800677-cbbc7000-c572-11eb-97e0-622d616ece71.png" alt="logo">
</div>

<br>

![mongoose](https://img.shields.io/badge/mongoose-5.12.10-brightgreen)
![KoaJS](https://img.shields.io/badge/koa-2.13.1-brightgreen)
![typescript](https://img.shields.io/badge/typescript-4.2.4-brightgreen)
![qiniu](https://img.shields.io/badge/qiniu-7.3.2-brightgreen)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

<br>

## :tada:技术栈

- #### Koa2： Koa -- 基于 Node.js 平台的下一代 Web 开发框架。
- #### TypeScript：通过在JavaScript的基础上添加静态类型定义构建而成的开源编程语言。
- #### Mongoose： 为node.js设计的优雅mongodb对象模型库。
- #### Redis: 连接Redis数据库快捷类库。

<br>

## :sparkles: 流程图
![process](https://user-images.githubusercontent.com/15929863/120813982-0200ec00-c581-11eb-9c60-8cece349c33c.png)

## :memo:目录结构

开发目录如下面解释所示：
```
## :sparkles:先前准备
需要相应的账号密码填写
```bash
# 监听端口
PORT=3000

# JWT加密秘钥
JWT_SECRET= xxx

# 数据库地址
DATABASE_URL=xxx

# 七牛云 ACCESS_KEY
ACCESS_KEY=xxx

# 七牛云 SECRET_KEY 
SECRET_KEY=xxx

# 七牛云 OSS-Space
UPLOAD_SPACE = xxx

# 域名1地址
DOMAIN=xxxx

# 网易邮箱发送
EMAIL=xxx@163.com
EMAILPASS=xxx

# redisLab
REDISHOST=xxx
REDISPORT=17781
REDISPASS=xxx
REDISPASS=8wLDeSdq6d522yY0BEVDSCiYp7QHw0pB
```
## :rocket:运行命令

```bash
// 安装依赖
yarn

// 开发环境运行
yarn watch-server

// 打包部署环境产物
yarn build

// 运行生产环境资源
yarn serve

// 检查代码风格
yarn lint

//停止运行
yarn stop
```
