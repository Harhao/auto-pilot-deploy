import React, { Suspense, lazy } from 'react';
import Loading from '@/component/loading';
import RequireAuth from '@/component/auth';
import {
    HomeOutlined,
    ProjectOutlined,
    SettingFilled,
} from '@ant-design/icons';
import { 
    createBrowserRouter, 
    RouterProvider,
    Navigate 
} from 'react-router-dom';

const Home = lazy(() => import('@/pages/home'));
const Project = lazy(() => import('@/pages/project'));
const NoMatch = lazy(() => import('@/pages/404'));
const Setting = lazy(() => import('@/pages/setting'));
const Login = lazy(() => import('@/pages/login'));
const Logs = lazy(() => import('@/pages/logs'));
const LogsDetail = lazy(() => import('@/pages/logs/detail'));
const Service = lazy(() => import('@/pages/service'));
const Layout = lazy(() => import('@/layout'));

export const privateRoutes =
{
    path: '/admin',
    element: <RequireAuth><Layout /></RequireAuth>,
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
        element: <Navigate to='/login' />,
    },
    {
        index: true,
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