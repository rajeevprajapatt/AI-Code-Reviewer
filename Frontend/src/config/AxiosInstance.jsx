import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PATH,
    withCredentials: true, // Include credentials (cookies) in requests
});


export default AxiosInstance;