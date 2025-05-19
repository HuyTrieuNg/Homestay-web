import React from "react";
import Header from "@components/admin/Header";
import UserStatistics from "@components/admin/UserStatistics";
import HomestayStatistics from "@components/admin/HomestayStatistics";
import BookingStatistics from "@components/admin/BookingStatistics";

const AdminDashboard = () => {
  const PRIMARY_COLOR = "#ff5a5f";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <UserStatistics />
            <HomestayStatistics />
          </div>
        </div>
        
        <div>
          <BookingStatistics />
        </div>
      </main>
      
      <footer className="bg-white p-4 border-t shadow-inner">
        <div className="container mx-auto text-center text-gray-500 transition-colors duration-300 hover:text-pink-700"
             style={{ hover: { color: PRIMARY_COLOR } }}>
          &copy; {new Date().getFullYear()} Bảng Điều Khiển Homestay. Bản quyền thuộc về chúng tôi.
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;