import React from 'react';
import animation from '@/component/Animation';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { EResponseMap } from '@/const';
import { createProject } from '@/api';

import './index.less';

function AddProject() {
    const navigate = useNavigate();

    const onFinish = async (values: Record<string, any>) => {
        const params = {...values, nginxConfig: JSON.parse(values.nginxConfig)};
        console.log(params);
        const res = await createProject(values);
        if (res.code === EResponseMap.SUCCESS) {
            message.success('构建项目成功');
            navigate('/dashbroad/proejct');
        }
    };

    return (
        <Form className="add-project-container" onFinish={onFinish}>
            <Form.Item label="项目名称" name="name" required>
                <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item label="git地址" name="gitUrl" required>
                <Input placeholder="请输入项目git地址" />
            </Form.Item>
            <Form.Item label="分支" name="branch" required>
                <Input placeholder="请输入项目分支" />
            </Form.Item>
            <Form.Item label="构建命令" name="command" required>
                <Input placeholder="请输入项目构建命令" />
            </Form.Item>
            <Form.Item label="部署目录" name="dest" required>
                <Input placeholder="请输入项目部署目录" />
            </Form.Item>
            <Form.Item label="构建工具" name="tool" required>
                <Select
                    defaultValue="yarn"
                    options={[
                        { value: 'yarn', label: 'yarn' },
                        { value: 'npm', label: 'npm' },
                        { value: 'pnpm', label: 'pnpm' },
                    ]}
                />
            </Form.Item>
            <Form.Item label="项目类型" name="type" required>
                <Select
                    defaultValue="frontEnd"
                    options={[
                        { value: 'frontEnd', label: 'frontEnd' },
                        { value: 'backEnd', label: 'backEnd' },
                    ]}
                />
            </Form.Item>
            <Form.Item label="nginx配置" name="nginxConfig" required>
                <TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default animation(AddProject);
