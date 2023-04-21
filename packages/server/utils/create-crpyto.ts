import { ServerConfig } from "../config";
import crypto from "crypto";

export class CreateCrpyto {

    private static algorithm = 'aes-256-cbc';
    private static key = crypto.randomBytes(32);
    private static iv = crypto.randomBytes(16);

    public static asymEncrypt(hash: string) {
        const hmac = crypto.createHmac("sha1", ServerConfig.jwtSecret);
        return hmac.update(hash).digest("base64");
    }

    public static symEncrypt(text: string) {
        const cipher = crypto.createCipheriv(CreateCrpyto.algorithm, CreateCrpyto.key, CreateCrpyto.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    };

    public static symDecrypt(encrypted: string) {
        const decipher = crypto.createDecipheriv(CreateCrpyto.algorithm, CreateCrpyto.key, CreateCrpyto.iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };

}