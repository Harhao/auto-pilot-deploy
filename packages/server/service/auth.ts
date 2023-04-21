import jwt from 'jsonwebtoken';
import { ServerConfig } from '../config';

interface IUserPayload {
    id: string | number;
    userName: string;
}

export default class AuthService {

    public static generateToken(user: IUserPayload) {      
        return jwt.sign(user, ServerConfig.jwtSecret, { expiresIn: '5h'});
    }

    public static verifyToken(token: string): IUserPayload {
        return  jwt.verify(token, ServerConfig.jwtSecret) as IUserPayload;
    }
}