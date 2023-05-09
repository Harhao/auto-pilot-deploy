import React, { useState } from 'react';

interface AuthContextType {
    token: string | null;
    signin: (token: string, callback?: VoidFunction) => void;
    signout: (callback?: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

// 提供给退出处理
export function AuthProvider(props: { children: React.ReactNode }) {

    const initialVal = localStorage.getItem('token') ?? null;
    const [token, setToken] = useState<string | null>(initialVal);

    const signin = (token: string, callback?: Function) => {
        setToken(token);
        localStorage.setItem('token', token);
        setTimeout(() => callback?.(), 200);
    }

    const signout = (callback?: Function) => {
        setToken(null);
        localStorage.removeItem('token');
        callback?.();
    }
    const value = { token, signin, signout };


    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
    return React.useContext(AuthContext);
}