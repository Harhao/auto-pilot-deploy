import { ServerConfig } from "../config";
import CryptoJS from "crypto-js";

export class CreateCrpyto {

    // 加密函数
    public static encrypt(text: string) {
        let encrypted =  CryptoJS.AES.encrypt(text, ServerConfig.cryptoRandom).toString()
        return encrypted;
    }

    // 解密函数
    public static decrypt(encrypted: string) {
        const bytes = CryptoJS.AES.decrypt(encrypted, ServerConfig.cryptoRandom);
        const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedPlaintext;
    }

}