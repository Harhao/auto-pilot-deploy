import React from "react";
import { login } from "@/api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { EResponseMap } from "@/const";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useDispatch } from 'react-redux';
import { setAuthToken } from "@/store/reducers/auth";

import "./index.less";

const loginContainer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [animation, api] = useSpring(
        () => ({
            from: { transform: "translateX(100%)" },
            to: { transform: "translateX(0%)"},
        }),
        []
    )

    const onFinish = async (values: { userName: string, password: string }) => {
        const res: any = await login({ ...values });
        if (res.code == EResponseMap.SUCCESS) {
            const token = res.data;
            dispatch(setAuthToken(token));
            navigate('/dashboard');
            message.open({ type: 'success', content: '登录成功'});
            return;
        }
        message.open({ type: 'error', content: '帐号密码不正确'})
    };

    return (
        <animated.div 
            className="login-container"
            style={animation} 
        >    
            <div className="login-bg"></div>   
            <div className="login-content">
                <div className="login-title">自动部署平台</div>
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
        </animated.div>
    );
};

export default loginContainer;
