import { CatchError } from "../decorator";
import { CreatePilotDto } from "../dto";
import { Inject, Injectable } from "../ioc";
import MongoDBService from "./mongo";

@Injectable
export default class PilotService {

    private static tableName: string = 'pilot';

    @Inject private mongodbService: MongoDBService;

    @CatchError()
    public async createPilot(data: CreatePilotDto) {
       const result =  await this.mongodbService.insertOne(PilotService.tableName, data);
    }

    @CatchError()
    public async updatePilot(data: CreatePilotDto) {
        const result = await this.mongodbService.updateOne(PilotService.tableName, { _id: data.id }, data);
    }

    @CatchError()
    public async getPilot(): Promise<CreatePilotDto> {
        const result: any = await this.mongodbService.findOne(PilotService.tableName, {});
        return result;
    }
}