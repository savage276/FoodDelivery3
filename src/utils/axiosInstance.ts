// src/utils/axiosInstance.ts
import axios from 'axios';
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: 'https://api.example.com', // 替换为你的后端 API 地址
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 你可以在这里添加请求拦截器和响应拦截器
axiosInstance.interceptors.request.use(
    config => {
        // 可以在这里添加 token 等
        const token = Cookies.get('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // 统一错误处理
        return Promise.reject(error);
    }
);

export default axiosInstance;