import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "@context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const PRIMARY_COLOR = "#ff5a5f";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-shadow duration-300 hover:shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: PRIMARY_COLOR }}>
          <span className="cursor-pointer" onClick={() => navigate("/admin")}>
            Bảng Điều Khiển Admin
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
              onClick={() => navigate("/admin/settings")}
              className="text-gray-700 hover:text-pink-600 transition-colors duration-300 relative group"
              style={{ hover: { color: PRIMARY_COLOR } }}
            >
              <span>Tùy Chỉnh</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                  style={{ backgroundColor: PRIMARY_COLOR }}></span>
            </button>
          </nav>
          
          {/* Tìm kiếm */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-all duration-300 hover:border-pink-400"
              style={{ 
                focusRing: PRIMARY_COLOR,
                hover: { borderColor: PRIMARY_COLOR } 
              }}
            />
          </div>
          
          {/* Thông báo và User menu */}
          <div className="flex items-center space-x-3">
            {/* Biểu tượng thông báo */}
            <div className="relative">
              <button className="relative p-1 text-gray-500 hover:text-pink-600 transition-colors duration-300"
                     style={{ hover: { color: PRIMARY_COLOR } }}>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full animate-pulse"
                      style={{ backgroundColor: PRIMARY_COLOR }}></span>
              </button>
            </div>
            
            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!isDropdownOpen)} 
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors duration-300 focus:outline-none"
                style={{ hover: { color: PRIMARY_COLOR } }}
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Admin"
                  className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-pink-500 transition-all duration-300"
                  style={{ hover: { borderColor: PRIMARY_COLOR } }}
                />
                <span className="ml-2 text-sm font-medium">{user?.name || "Admin"}</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 animate-fadeIn">
                  <button 
                    onClick={() => navigate("/admin/profile")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-300"
                    style={{ hover: { backgroundColor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR } }}
                  >
                    Hồ sơ
                  </button>
                  <button 
                    onClick={() => navigate("/admin/settings")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-300"
                    style={{ hover: { backgroundColor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR } }}
                  >
                    Cài đặt
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 transition-colors duration-300"
                    style={{ color: PRIMARY_COLOR, hover: { backgroundColor: `${PRIMARY_COLOR}10` } }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
