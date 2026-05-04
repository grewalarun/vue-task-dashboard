import axios from 'axios'

const BASE_URL = 'https://task-management-virid-omega.vercel.app'
export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tf_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An error occurred'
        return Promise.reject(new Error(message))
    }
)




