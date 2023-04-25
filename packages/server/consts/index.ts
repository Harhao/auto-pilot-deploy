export enum EResponseCodeMap {
    SUCCESS = 200,
    NORMALERROR = 400,
    UNAUTHORIZE = 401,
    USEREXIST = 402,
    SERVERERROR = 500
}

export enum ELogsRunStatus {
    RUNNING,
    INTERRUPT,
    ERROR,
    SUCCESS,
}