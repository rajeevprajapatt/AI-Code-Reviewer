import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PATH,
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export default AxiosInstance