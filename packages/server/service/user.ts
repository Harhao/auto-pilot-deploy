import MongoDBService from "./mongo";
import AuthService from "../service/auth";

import { Inject, Injectable } from "../ioc";
import { CatchError } from "../decorator";
import { LoginUserDto, createUserDto } from "../dto";
import { EResponseCodeMap } from "../consts";
import { CreateCrpyto } from "../utils";


@Injectable
export default class UserService {

    private static tableName: string = 'users';

    @Inject private mongodbService: MongoDBService;

    @CatchError()
    public async login(data: LoginUserDto) {
        const user = await this.mongodbService.findOne(UserService.tableName, {
            userName: data.userName,
            password: CreateCrpyto.asymEncrypt(data.password)
        });

        if (!!user) {
            const token = AuthService.generateToken({
                id: user._id,
                userName: user.userName,
            });
            return {
                code: EResponseCodeMap.SUCCESS,
                data: token,
                msg: 'success'
            };
        }
        return {
            code: EResponseCodeMap.NORMALERROR,
            data: null,
            msg: 'success'
        }
    }

    @CatchError()
    public async register(data: createUserDto) {
        const matchUser = await this.mongodbService.findOne(UserService.tableName, data);

        if (!matchUser) {
            const insertInfo = { ...data, password: CreateCrpyto.asymEncrypt(data.password)};
            const newUser = await this.mongodbService.insertOne(UserService.tableName, insertInfo);
            return {
                code: EResponseCodeMap.SUCCESS,
                data: newUser,
                msg: 'success'
            }
        }
        return {
            code: EResponseCodeMap.USEREXIST,
            data: null,
            msg: 'success'
        }
    }
}