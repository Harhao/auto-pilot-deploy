import React from "react";
import { login } from "@/api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { EResponseMap } from "@/const";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import "./index.scss";

const loginContainer = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const onFinish = async (values: { userName: string, password: string }) => {
        const res: any = await login({ ...values });
        if (res.code == EResponseMap.SUCCESS) {
            auth.signin(res.data, () => {
                navigate('/admin/project');
            })
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="userName"
                        rules={[{ required: true, message: '请输入您的用户名!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="请输入您的用户名!"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            size="large"
                            placeholder="请输入您的密码!"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            className="login-form-button"
                            block
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default loginContainer;
