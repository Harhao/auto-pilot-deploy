import { createHash } from 'crypto'
import config from '../config/config'
import request from 'request'
import { v4 as uuidv4 } from 'uuid';

const ACCESSTOKENURl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.AppID}&secret=${config.AppSecret}`
const TICKETURL = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi`

export default class WechatAuth {
  public static getAccessToken() {
    return new Promise((resolve, reject) => {
      request(ACCESSTOKENURl, (e: any, res: any, body: any) => {
        if (e) {
          reject(e)
        }
        resolve(JSON.parse(res.body))
      })
    })
  }

  public static getTicket(token: string) {
    return new Promise((resolve, reject) => {
      const url = `${TICKETURL}&access_token=${token}`
      request(url, (e: any, res: any, body: any) => {
        if (e) {
          reject(e)
        }
        resolve(JSON.parse(res.body))
      })
    })
  }
  public static getWxConfigData(ticket: string, url: string) {
    return new Promise((resolve, reject) => {
      const timestamp = Math.round(new Date().getTime() / 1000)
      const noncestr = uuidv4();
      const crytpoStr = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
      const wxConfig = {
        signature: WechatAuth.createSignHash(crytpoStr),
        noncestr,
        timestamp,
        ticket,
        appId: config.AppID,
      }
      resolve(wxConfig)
    })
  }

  public static createSignHash(content: string) {
    const hash = createHash('sha1')
    hash.update(content)
    return hash.digest('hex')
  }
}
