import { useState } from "react";
import Sidebar from "@components/host/Sidebar";
import Header from "@components/host/Header";
import HomestayUpdateView from "@components/host/HomestayUpdateView";

function Dashboard() {
  const [selectedHomestayId, setSelectedHomestayId] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const handleRefresh = () => {
    setRefreshSidebar((prev) => !prev);
  };

  const handleDeleteHomestay = () => {
    setSelectedHomestayId(null);
    handleRefresh();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar  
          onSelectHomestay={setSelectedHomestayId} 
          refresh={refreshSidebar}
        />

        {/* Main View */}
        <div className="flex-1 p-4 overflow-auto">
          {selectedHomestayId ? (
            <HomestayUpdateView 
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
    </div>
  );
}

export default Dashboard;
