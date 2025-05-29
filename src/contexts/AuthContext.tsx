import React, {createContext, useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {message} from 'antd';
import {Merchant, User} from '../types';
import {
    api_users_login as userLogin,
    api_users_register as userRegister,
    checkAuth,
    logout as userLogout,
} from '../services/api_users.ts';
import Cookies from "js-cookie";

interface AuthContextType {
    role: User | Merchant | null;
    roleType: "User" | "Merchant" | null;
    token: string | null;
    loading: boolean;
    user_login: (email: string, password: string) => Promise<void>;
    user_register: (username: string, email: string, password: string) => Promise<void>;
    user_logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [role, setRole] = useState<User | Merchant | null>(null);
    const [roleType, setRoleType] = useState<"User" | "Merchant" | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 获取持久化的token
                const auth_token = Cookies.get('auth_token');
                if (!auth_token) {
                    // 无token，直接重新登录
                    navigate('/login', {replace: true});
                } else {
                    // 有token， 确认当前角色
                    const role_type = Cookies.get('role_type');
                    if (role_type === "User") {
                        // 验证token合法性
                        const auth = await checkAuth();
                        if (auth) {
                            // 合法
                            setRole(auth.data.user);
                            setRoleType(role_type);
                            setToken(auth.data.token);

                            // Only redirect if on a public route
                            if (PUBLIC_ROUTES.includes(location.pathname)) {
                                navigate('/', {replace: true});
                            }
                        } else if (!PUBLIC_ROUTES.includes(location.pathname)) {
                            // 非法
                            navigate('/login', {replace: true});
                        }
                    } else if (role_type === "merchant") { /* empty */
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                navigate('/login', {replace: true});
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const user_login = async (phone: string, password: string) => {
        try {
            const response = await userLogin({phone, password});

            // Update state first
            setRole(response.data.user);
            setToken(response.data.token);

            message.success('登录成功');

            // Navigate after state is updated
            navigate('/', {replace: true});
            console.log("successfully jump to main page");
        } catch (error) {
            message.error(error instanceof Error ? error.message : '登录失败');
            throw error;
        }
    };

    const user_register = async (username: string, email: string, password: string) => {
        try {
            const response = await userRegister({username, email, password});

            // Update state first
            await Promise.all([
                setRole(response.data.user),
                setToken(response.data.token)
            ]);

            message.success('注册成功');

            // Navigate after state is updated
            setTimeout(() => {
                navigate('/', {replace: true});
            }, 100);
        } catch (error) {
            message.error(error instanceof Error ? error.message : '注册失败');
            throw error;
        }
    };

    const user_logout = () => {
        userLogout();
        setRole(null);
        setToken(null);
        message.success('已退出登录');
        navigate('/login', {replace: true});
    };

    return (
        <AuthContext.Provider value={{role, roleType, token, loading, user_login, user_register, user_logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};