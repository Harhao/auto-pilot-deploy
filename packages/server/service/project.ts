import { Inject, Injectable } from "../ioc";

import CmdService from "./cmd";



@Injectable
export default class ProjectService {

    @Inject cmdService: CmdService;

    public async createProject() {}

}