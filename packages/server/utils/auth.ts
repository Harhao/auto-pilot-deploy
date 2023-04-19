import crytpo from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import jwt from 'koa-jwt'
import { ServerConfig } from '../config'

export interface UserParams {
  _id: string
  name: string
}
export default class Auth {
  // 获取验证的用户token值
  public static getUserToken(userData: UserParams, options?: any): string {
    return jsonwebtoken.sign(userData, ServerConfig.jwtSecret, options)
  }

  // 验证用户token值
  public static verifyUserToken(): jwt.Middleware {
    return jwt({ secret: ServerConfig.jwtSecret })
  }
  // 加密密码
  public static createHash(password: string): string {
    const sha256 = crytpo.createHash('sha256')
    const passwodHash = sha256.update(password)
    return passwodHash.digest('hex')
  }
}
