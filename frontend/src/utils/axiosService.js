import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import axiosInstance from "./axiosInstance";


const baseURL = import.meta.env.VITE_BASE_URL;

export const setupAxiosInterceptors = (
  authTokens,
  setAuthTokens,
  setUser,
  logoutUser
) => {
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.response.clear();

  if (authTokens?.access) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${authTokens.access}`;
  } else {
    delete axiosInstance.defaults.headers.Authorization;
  }

  // Request interceptor for token refresh
  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens) return req;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    console.log("Token expired, refreshing...");

    try {
      // Use a regular axios call to avoid interceptor loop
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      const newTokens = response.data;
      localStorage.setItem("authTokens", JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      setUser(jwtDecode(newTokens.access));

      req.headers.Authorization = `Bearer ${newTokens.access}`;
      console.log("Token refreshed successfully!");
    } catch (error) {
      console.error("Token refresh failed:", error);
      if (logoutUser) logoutUser();
      else {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        delete axiosInstance.defaults.headers.Authorization;
      }
    }

    return req;
  });

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API error:", error);

      // Handle 401 Unauthorized errors
      if (error.response && error.response.status === 401) {
        if (authTokens && logoutUser) {
          console.log("Unauthorized error, logging out...");
          logoutUser();
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;