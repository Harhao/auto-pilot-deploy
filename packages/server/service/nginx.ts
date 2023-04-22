import { Inject, Injectable } from "../ioc";
import MongoDBService from "./mongo";

@Injectable
export default class NginxService {

    @Inject mongodbService: MongoDBService;

    public async createNginx() {}


    public async updateNginx() {}


    public async deleteNginx() {

    }

    public async getNginx() {}
}