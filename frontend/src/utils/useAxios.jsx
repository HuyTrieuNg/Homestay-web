import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = import.meta.env.VITE_BASE_URL;
// console.log("Base URL from Vite:", baseURL);

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
      },
    });
  }, [authTokens]);

  useEffect(() => {
    // Interceptor request chỉ thêm 1 lần
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (req) => {
        if (!authTokens) return req;

        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          req.headers.Authorization = `Bearer ${authTokens.access}`;
          return req;
        }

        try {
          const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: authTokens.refresh,
          });

          localStorage.setItem("authTokens", JSON.stringify(response.data));
          setAuthTokens(response.data);
          setUser(jwtDecode(response.data.access));

          req.headers.Authorization = `Bearer ${response.data.access}`;
        } catch (error) {
          console.error("Token refresh failed:", error);
          setAuthTokens(null);
          setUser(null);
          localStorage.removeItem("authTokens");
        }

        return req;
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API error:", error);
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor khi component unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [authTokens, setAuthTokens, setUser, axiosInstance]);

  return axiosInstance;
};

export default useAxios;
