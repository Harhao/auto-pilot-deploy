import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './index.less';

export default function PBreadCrumb() {
    const location = useLocation();
    const list = useSelector((state: any) => state.routeList);

    const [breadCrumbItems, setBreadCrumbItems] = useState<any>([]);

    const getBreadCrumbItems = () => {
        const pathSnippets = location.pathname.split('/').filter((i) => i);
        const items: { key: string; title: JSX.Element; }[] = [];
        pathSnippets.forEach((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const name = getRouteTitle(url);
            if(name) {
                items.push({
                    key: url,
                    title: <Link to={url}>{name}</Link>,
                });
            }
            
        });
        setBreadCrumbItems(items);
    };

    const getRouteTitle = (url: string) => {
        const result = list.find((route: { key: string; }) => {
            const regexStr = route.key.replace(/:[^/]+/g, '([^/]+)');
            const regex = new RegExp(`^${regexStr}$`);
            const match = regex.test(url);
            if (match) {
                return route;
            }
        });
        return result ? result.value : null;
    };

    useEffect(() => {
        if (list.length > 0) {
            getBreadCrumbItems();
        }
    }, [location]);

    return <Breadcrumb items={breadCrumbItems} className="breadcrumb-container"/>;
}
