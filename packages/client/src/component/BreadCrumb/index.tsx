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
        const items = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const title = getRouteTitle(url);
            return title ? { key: url, title: <Link to={url}>{title}</Link> } : null;
        }).filter(Boolean);
        setBreadCrumbItems(items);
    };


    const getRouteTitle = (url: string) => {
        const segments = url.split('/').filter((i) => i);
        const result = list.find((route: { key: string; }) => {
            const routeSegments = route.key.split('/').filter((i) => i);
            if (segments.length !== routeSegments.length) {
                return false;
            }
            return segments.every((segment, index) => {
                return segment === routeSegments[index] || routeSegments[index].startsWith(':');
            });
        });
        return result ? result.value : null;
    };


    useEffect(() => {
        if (list.length > 0) {
            getBreadCrumbItems();
        }
    }, [location]);

    return <Breadcrumb items={breadCrumbItems} className="breadcrumb-container" />;
}
