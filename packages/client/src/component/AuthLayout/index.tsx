
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from '@/layout';

export default function RequireAuthLayout() {
    const location = useLocation();
    const { isAuthorized } = useSelector((state: any) => state.auth);

    if (!isAuthorized) {
        return <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />;
    }

    return <Layout />;
}