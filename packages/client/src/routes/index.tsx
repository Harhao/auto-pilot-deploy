import React, { Suspense, lazy } from 'react';
import Loading from '@/component/Loading';

import {
    HomeOutlined,
    ProjectOutlined,
    SettingFilled,
} from '@ant-design/icons';
import { 
    createBrowserRouter, 
    RouterProvider,
} from 'react-router-dom';

const Home = lazy(() => import('@/views/home'));
const Project = lazy(() => import('@/views/project'));
const NoMatch = lazy(() => import('@/views/NoMatch'));
const Setting = lazy(() => import('@/views/setting'));
const Login = lazy(() => import('@/views/login'));
const Logs = lazy(() => import('@/views/logs'));
const LogsDetail = lazy(() => import('@/views/logs/detail'));
const Service = lazy(() => import('@/views/service'));
const RequireAuthLayout = lazy(() => import('@/component/AuthLayout'));

export const privateRoutes =
{
    path: '/dashboard',
    element: <RequireAuthLayout />,
    children: [
        {
            index: true,
            path: 'home',
            icon: <HomeOutlined />,
            label: '主页',
            element: <Home />
        },
        {
            path: 'project',
            icon: <ProjectOutlined />,
            label: '项目列表',
            element: <Project />,
        },
        {
            path: 'setting',
            icon: <SettingFilled />,
            label: '权限配置',
            element: <Setting />
        },
        {
            path: 'service/:name',
            icon:  null,
            label: 'node服务',
            element: <Service />
        },
        {
            path: 'logs/:id',
            icon: null,
            label: '运行日志',
            element: <Logs />
        },
        {
            path: 'logsDetail/:projectId/:logId?',
            icon: null,
            label: '日志详情',
            element: <LogsDetail />
        },
    ],
};

const routes = [
    {
        path: '/',
        element: <RequireAuthLayout />,
    },
    {
        path: '/login',
        icon: null,
        label: '登陆页',
        element: <Login />
    },
    {
        path: '*',
        icon: null,
        label: '错误',
        element: <NoMatch />
    },
    privateRoutes,
];

export default function PilotRouter() {

    return (
        <Suspense fallback={<Loading />}>
            <RouterProvider
                router={createBrowserRouter(routes)}
            />
        </Suspense>
    );
}