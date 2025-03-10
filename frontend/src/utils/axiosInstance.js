import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
});
export default axiosInstance;