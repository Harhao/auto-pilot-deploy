import { ELogsRunStatus } from '@/const';
import { Tag } from 'antd';
import React, { useCallback } from 'react';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

export interface IRunnigProps {
    status: any;
}
export default function RunningStatus(props: IRunnigProps) {

    const RenderComponent = useCallback(() => {
        let renderComponent = null;
        switch (props.status) {
            case ELogsRunStatus.ERROR: renderComponent = <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>; break;
            case ELogsRunStatus.INTERRUPT: renderComponent = <Tag icon={<MinusCircleOutlined />} color="default">已取消</Tag>; break;
            case ELogsRunStatus.SUCCESS: renderComponent = <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>; break;
            case ELogsRunStatus.RUNNING: renderComponent = <Tag icon={<SyncOutlined spin />} color="processing">运行中</Tag>; break;
        }
        
        return renderComponent;
    }, [props.status]);

    return props?.status >= 0 ? <RenderComponent />: null;
}