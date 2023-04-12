export enum EProjectType {
    FRONTEND = 'frontEnd',
    BACKEND = 'backEnd'
}


export interface IPilotCofig {
    address: string;
    serverPass: string;
    gitUser: string;
    gitPass: string;
}

export interface IProjectCofig {
    gitUrl: string;
    branch: string;
    tool: string;
    command: string;
    dest: string;
    type: string;
}