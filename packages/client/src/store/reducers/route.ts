import { createSlice } from '@reduxjs/toolkit';
import { routes } from '@/routes';


const list: { key: string; value: string; }[] = [];

const getBreadCrumbNameMap = (routes: any[], routePrefix = '') => {
    routes.forEach((route) => {
        const routeName =
            route.path.indexOf('/') === 0
                ? `${routePrefix}${route.path}`
                : `${routePrefix}/${route.path}`;
        list.push({ key: routeName, value: route.label });
        if (route?.children?.length > 0) {
            getBreadCrumbNameMap(route.children, route.path);
        }
    });
};

const getInitalState = () => {
    getBreadCrumbNameMap(routes);
    return list;
};


const routeSlice = createSlice({
    name: 'routeList',
    initialState: getInitalState(),
    reducers: {}
});

export default routeSlice.reducer;
