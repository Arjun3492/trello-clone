import React, { createContext, useState, useContext } from 'react';
import axiosInstance from '../axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (formData) => {
        const response = await axiosInstance.post('/auth/login', formData);
        if (response.status !== 200) {
            alert(response.data.msg);
            return false;
        }
        setUser(JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
    };

    const register = async (formData) => {
        const response = await axiosInstance.post('/auth/register', formData);
        if (response.status !== 200) {
            alert(response.data.msg);
            return false;
        }
        setUser(JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
