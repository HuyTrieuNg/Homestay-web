import React, { useState, useContext, useEffect } from 'react';
import AuthContext from "@context/AuthContext";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const PRIMARY_COLOR = "#ff5a5f";

  const isAuthenticated = useAuth();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance
        .get("/profile/avatar")
        .then((response) => {
          console.log("API Response:", response.data);
          setAvatar(response.data.avatar_url);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: PRIMARY_COLOR }}>
          <span className="flex items-center cursor-pointer " onClick={() => navigate("/admin")}>
            <img
              src="https://res.cloudinary.com/drfwzrqqj/image/upload/v1747688845/create_logo_for_stayhub_with_1_1_ratio_no_text_primary_color_FF5A5F_no_background_eiqhu7.png" 
              alt="Logo"
              className="h-10 w-10 mr-3 rounded-full scale-150"
            />
            <span className="text-2xl font-bold transition-colors duration-300" style={{ color: PRIMARY_COLOR }}>StayHub Admin</span>
          </span>
        </h1>
        
        <div className="flex items-center space-x-6">
          {/* Menu chính */}
          <nav className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate("/admin")} 
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Tổng Quan</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button 
              onClick={() => navigate("/admin/users")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Quản Lý Người Dùng</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button 
              onClick={() => navigate("/admin/homestays")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Quản Lý Homestay</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
            <button 
              onClick={() => navigate("/admin/feature-settings")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Tùy Chỉnh</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
          </nav>
          
          
          
          {/* User Menu */}
          <div className="relative">
            {authTokens ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user?.name || "Người dùng"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
