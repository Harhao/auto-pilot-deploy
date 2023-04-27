import React, { lazy } from "react";
import Layout from "../layout/index";
import {
    HomeOutlined,
    ProjectOutlined,
    SettingFilled,
} from '@ant-design/icons';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import('@/pages/home'));
const Project = lazy(() => import('@/pages/project'));
const NoMatch = lazy(() => import('@/pages/404'));
const Setting = lazy(() => import('@/pages/setting'));


export const privateRoutes =
{
    path: '/admin',
    element: <Layout />,
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
            children: [
                // {
                //     path: 'detail/:logId',
                //     element: <ProjectDetail />
                // },
                // {
                //     path: 'logs/:projectId',
                //     element: <ProjectDetail />
                // },
            ]
        },
        {
            path: 'setting',
            icon: <SettingFilled />,
            label: '权限配置',
            element: <Setting />
        },
    ],
};

const routes = [
    privateRoutes,
    {
        path: "*",
        icon: <SettingFilled />,
        label: '错误',
        element: <NoMatch />
    },
];

function Fallback() {
    return <p>Performing initial data load</p>;
}

export default function PilotRouter() {
    return (
        <RouterProvider
            router={createBrowserRouter(routes)}
            fallbackElement={<Fallback />}
        />
    );
}