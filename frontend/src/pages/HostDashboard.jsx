// src/pages/Dashboard.jsx
import { useState } from "react";
import Sidebar from "@components/host/Sidebar";
import HomestayDetail from "@components/host/HomestayDetail";

function Dashboard() {
  const [selectedHomestayId, setSelectedHomestayId] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const handleRefresh = () => {
    setRefreshSidebar((prev) => !prev); // Thay đổi để Sidebar cập nhật danh sách
  };

  const handleDeleteHomestay = () => {
    setSelectedHomestayId(null); // Ẩn chi tiết nếu homestay bị xóa
    handleRefresh(); // Gọi để cập nhật lại Sidebar
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar  
          onSelectHomestay={setSelectedHomestayId} 
          refresh={refreshSidebar}
      />
      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4">
        {selectedHomestayId ? (
          <HomestayDetail 
            id={selectedHomestayId}
            onDelete={handleDeleteHomestay} 
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Vui lòng chọn Homestay để xem chi tiết.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
