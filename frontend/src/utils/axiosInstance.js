import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
