import React from 'react';
import animation from '@/component/Animation';
import {
    Button,
    Form,
    Input,
    Select,
    message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { createPilot } from '@/api';
import { EResponseMap } from '@/const';

const AddSetting: React.FC = () => {

    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        const res = await createPilot(values);
        if(res.code === EResponseMap.SUCCESS) {
            message.success('添加成功');
            navigate(-1);
        }
    };

    return (
        <Form 
            name="wrap"
            labelCol={{ flex: '130px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            onFinish={onFinish}
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
                    defaultValue=""
                    options={[
                        { value: 'prod', label: '正式' },
                        { value: 'test', label: '测试' },
                        { value: 'grey', label: '灰度' },
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

export default animation(AddSetting);
