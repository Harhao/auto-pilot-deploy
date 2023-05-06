export enum EResponseMap {
    SUCCESS =  200,
    EXPIRES = 401
};
export interface IResponse {
    code: number;
    data: any;
    msg: string;
}

