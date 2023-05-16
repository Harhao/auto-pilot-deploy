import React, { useState } from 'react';
import animation from '@/component/Animation';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import { EResponseMap } from '@/const';
import { createProject, getProjectList } from '@/api';
import { useMount } from 'ahooks';

import './index.less';

function AddProject() {

    const navigate = useNavigate();
    const params = useParams();
    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState<any>({});

    const handleJsonChange = (newData: any) => {
        if(!newData.error) {
            setJsonData(newData.jsObject);
        }
    };

    const onFinish = async (values: Record<string, any>) => {
        const params = {...values, nginxConfig: jsonData.jsObject};
        const res = await createProject(params);
        if (res.code === EResponseMap.SUCCESS) {
            message.success('添加项目成功');
            navigate(-1);
        }
    };

    const onGetProjects = async (id: string) => {
        const res = await getProjectList({ projectId: id});
        console.log(res);
        if(res.code === EResponseMap.SUCCESS) {
            const { list } = res.data;
            console.log(list?.[0])
            setFormData({
                ...list?.[0],
            })
        }
    }

    useMount(() => {     
        if(params?.id) {
            onGetProjects(params.id); 
        }
    });

    return (
        <Form 
            name="wrap"
            labelCol={{ flex: '100px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            initialValues={formData}
            className="add-project-container" 
            onFinish={onFinish}
        >
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
            <Form.Item label="构建工具" name="tool" required hasFeedback>
                <Select
                    defaultValue="yarn"
                    options={[
                        { value: 'yarn', label: 'yarn' },
                        { value: 'npm', label: 'npm' },
                        { value: 'pnpm', label: 'pnpm' },
                    ]}
                />
            </Form.Item>
            <Form.Item label="项目类型" name="type" required hasFeedback>
                <Select
                    defaultValue="frontEnd"
                    options={[
                        { value: 'frontEnd', label: 'frontEnd' },
                        { value: 'backEnd', label: 'backEnd' },
                    ]}
                />
            </Form.Item>
            <Form.Item label="nginx配置" name="nginxConfig" required>
                <JSONInput
                    id="jsonEditor"
                    locale={locale}
                    placeholder={jsonData}
                    onChange={handleJsonChange}
                    height="300px"
                    width='100%'
                />
            </Form.Item>
            <Form.Item label=" ">
                <Button type="primary" htmlType="submit" block size="large">
                    提交
                </Button>
            </Form.Item>
        </Form>
    );
}

export default animation(AddProject);
