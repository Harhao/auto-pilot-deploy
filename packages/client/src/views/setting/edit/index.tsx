import React, { useState } from 'react';
import animation from '@/component/Animation';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
} from 'antd';


const Setting: React.FC = () => {
    
    const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

    return (
        <Form 
            name="wrap"
            labelCol={{ flex: '130px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            className="add-project-container" 
        >
            <Form.Item label="服务器IP" name="address" required>
                <Input placeholder="请输入服务器IP" />
            </Form.Item>
            <Form.Item label="服务器帐号" name="account" required>
                <Input placeholder="请输入服务器帐号" />
            </Form.Item>
            <Form.Item label="服务器密码" name="serverPass" required>
                <Input placeholder="请输入服务器密码" />
            </Form.Item>
            <Form.Item label="Git用户名" name="gitUser" required>
                <Input placeholder="请输入Git用户名" />
            </Form.Item>
            <Form.Item label="git授权token" name="gitPass" required>
                <Input placeholder="请输入git token" />
            </Form.Item>
            <Form.Item label="环境" name="env" required hasFeedback>
                <Select
                    defaultValue="prod"
                    options={[
                        { value: 'prod', label: 'prod' },
                        { value: 'test', label: 'test' },
                        { value: 'grey', label: 'grey' },
                    ]}
                />
            </Form.Item>
            <Form.Item label=" ">
                <Button type="primary" htmlType="submit" block size="large">
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
};

export default animation(Setting);