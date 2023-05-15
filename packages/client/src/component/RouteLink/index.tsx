import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import './index.less';


export interface IRouteProps {
    children?: React.ReactNode;
    to: string;
    props?: any;
}

export default function RouteLink({
    children,
    to,
    ...props
}:IRouteProps) {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        <Link
            to={to}
            {...props}
            className={ match ? 'active': '' }
        >
            {children}
        </Link>
    );
}
