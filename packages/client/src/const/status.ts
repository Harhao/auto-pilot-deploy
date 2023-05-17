export enum ELogsRunStatus {
    RUNNING,
    INTERRUPT,
    ERROR,
    SUCCESS,
}

export const deployStatus: Record<number, { msg: string, color: string }> = {
    [ELogsRunStatus.RUNNING]: { msg: '运行中', color: 'processing' },
    [ELogsRunStatus.INTERRUPT]: { msg: '已取消', color: 'default' },
    [ELogsRunStatus.ERROR]: { msg: '运行错误', color: 'error' },
    [ELogsRunStatus.SUCCESS]: { msg: '成功', color: 'success' },
};

export const serviceStatus:Record<string, string> = {
    online: 'success',
    stopped: 'error'
};

export const  Eenviroment  = {
    "prod": '正式',
    "grey" :'灰度',
    "test" :'测试'
}