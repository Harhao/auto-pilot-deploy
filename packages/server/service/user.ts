import { Injectable, CatchError } from "../decorator";

@Injectable
export default class UserService {

    @CatchError()
    public async login() {
        
    }

    @CatchError() 
    public async register() {
       const { mongodbService } = (UserService as any).service;
       mongodbService.insertOne('users', {});
    }
}