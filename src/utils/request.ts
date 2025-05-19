import axios from 'axios'

const request = axios.create({
    baseURL: "https://localhost:3000/api",
    timeout: 10000,
})

request.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})

request.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
})

export {request}