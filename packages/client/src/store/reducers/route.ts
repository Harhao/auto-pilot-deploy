import { createSlice } from '@reduxjs/toolkit';
import { routes } from '@/routes';

const getBreadCrumbNameMap = (routes: any[], routePrefix = '') => {
    const map: { key: string; value: any; }[] = [];

    routes.forEach((route) => {
        const routeName =
            route.path.indexOf('/') === 0
                ? `${routePrefix}${route.path}`
                : `${routePrefix}/${route.path}`;
        map.push({ key: routeName, value: route.label });
        if (route?.children?.length > 0) {
            map.push(...getBreadCrumbNameMap(route.children, route.path));
        }
    });

    return map;
};

const getInitialState = () => {
    return getBreadCrumbNameMap(routes);
};

const routeSlice = createSlice({
    name: 'routeList',
    initialState: getInitialState(),
    reducers: {},
});

export default routeSlice.reducer;
