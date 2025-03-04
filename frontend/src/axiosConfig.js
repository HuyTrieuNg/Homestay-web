import axios from "axios";

const axiosInstance = axios.create({
    //Thêm file .env vào fronend/ nội dung VITE_BASE_URL=http://127.0.0.1:8000/api/
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
