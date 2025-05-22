import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axiosInstance from "@utils/axiosInstance";
import { setupAxiosInterceptors } from "@utils/axiosService";

const AuthContext = createContext(null);

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Logout function
  const logoutUser = useCallback(() => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    delete axiosInstance.defaults.headers.Authorization;
    // navigate('/login')
  }, []);

  const setupInterceptors = useCallback(() => {
    setupAxiosInterceptors(authTokens, setAuthTokens, setUser, logoutUser);
  }, [authTokens, logoutUser]);

  // Login function
  const loginUser = async (username, password) => {
    try {
      const response = await axiosInstance.post("/token/", {
        username,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        console.log("Login successful:", jwtDecode(data.access));
        // Xử lý chuyển hướng dựa trên role
        const userRole = jwtDecode(data.access).type;
        const currentPath = location.pathname;
        if (currentPath.startsWith("/booking")) {
          window.location.reload();
        } else {
          // Chuyển hướng theo role
          if (userRole === 'admin') {
            navigate("/admin");
          } else if (userRole === 'host') {
            navigate("/host");
          } else {
            // Mặc định (guest) chuyển về trang chủ
            navigate("/");
          }
        }
      } else {
        console.error("Login failed:", response.status, data);
        alert(
          "Check login credentials: Something went wrong while logging in!"
        );
      }
      //  else {
      //   console.error("Login failed:", response.status, data);
      //   alert(
      //     "Check login credentials: Something went wrong while logging in!"
      //   );
      // }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        return "Tên đăng nhập hoặc mật khẩu không đúng";
      }

      if (error.response && error.response.data) {
        if (error.response.data.error) {
          return error.response.data.error;
        }
        return error.response.data.detail || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      }
      return "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      // alert("Check login credentials: Something went wrong while logging in!");
    }
  };

  // Register function
  const registerUser = async (phone, username, password, password2) => {
    try {
      const response = await axiosInstance.post("/register/", {
        phone,
        username,
        password,
        password2,
      });

      const data = response.data;

      if (response.status === 201) {
        navigate("/login");

        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            title: "Đăng ký thành công! Hãy đăng nhập",
            icon: "success",
            toast: true,
            timer: 6000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        });

        return { success: true };
      } else {
        console.error("Lỗi server:", response.status, data);

        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            title: `Lỗi ${response.status}: ${
              data.detail || "Đăng ký thất bại!"
            }`,
            icon: "error",
            toast: true,
            timer: 6000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        });
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // let errorMessage = "Đăng ký thất bại! Vui lòng thử lại.";

      if (error.response) {
        const errorData = error.response.data;
        let errors = {};

        // Xử lý từng lỗi cụ thể từ API
        if (errorData.username) {
          errors.username = errorData.username;
        }
        if (errorData.phone) {
          errors.phone = errorData.phone;
        }
        if (errorData.password) {
          errors.password = errorData.password;
        }
        if (errorData.password2) {
          errors.password2 = errorData.password2;
        }

        return { success: false, errors };
      }

      // Nếu lỗi không đến từ API (lỗi mạng, lỗi server)
      return {
        success: false,
        errors: { general: ["Đăng ký thất bại! Vui lòng thử lại."] },
      };
    }
  };

  // Initialize auth system and update interceptors when auth tokens change
  useEffect(() => {
    setupInterceptors();
    setLoading(false);
  }, [setupInterceptors]);

  const contextData = {
    user,
    authTokens,
    setUser,
    setAuthTokens,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};