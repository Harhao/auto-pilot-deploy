import { createSlice, CaseReducer } from '@reduxjs/toolkit';

export interface IAuthState {
    isAuthorized: boolean;
    authToken: string | null;
}

interface IPayload {
    payload: string,
    type: string;
}

const getInitalState = () => {
    const token = localStorage.getItem('token');
    return {
        isAuthorized: !!token,
        authToken: token ,
    };
};


const setAuthTokenReducer: CaseReducer<IAuthState, IPayload> = (state, action) => {
    state.authToken = action.payload;
    state.isAuthorized = true;
    localStorage.setItem('token', action.payload)
};

const clearAuthTokenReducer: CaseReducer<IAuthState> = (state) => {
    state.authToken = null;
    state.isAuthorized = false;
    localStorage.removeItem('token');
}

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitalState(),
    reducers: {
        setAuthToken: setAuthTokenReducer,
        clearAuthToken: clearAuthTokenReducer,
    },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;
