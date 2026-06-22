import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PATH,
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No token found for request:", config.url);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default AxiosInstance;