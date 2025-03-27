import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        setIsAuthenticated(!isExpired);
      } catch (error) {
        console.error("Error decoding token:", error.message || error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
