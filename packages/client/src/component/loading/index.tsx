import React from 'react';
import { Spin } from "antd";
import "./index.less";


const Loading = () => {
    return (
        <div className="loading-conainer">
            <Spin size="large" />
        </div>
    );
}

export default Loading;