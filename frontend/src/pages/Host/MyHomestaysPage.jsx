import { useState } from "react";
import Sidebar from "@components/host/Sidebar";
import Header from "@components/host/Header";
import HomestayUpdateView from "@components/host/HomestayUpdateView";

function MyHomestaysPage() {
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
      <div className="fixed top-0 left-0 w-full h-16 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex mt-16 h-[calc(100vh-64px)]">
        {/* Sidebar - Cố định bên trái */}
        <div className="fixed top-16 left-0 w-1/4 bg-gray-100 border-r shadow-lg overflow-auto">
          <Sidebar 
            onSelectHomestay={setSelectedHomestayId} 
            selectedHomestay={selectedHomestayId}
            refresh={refreshSidebar} 
          />
        </div>

        {/* Nội dung chính */}
        <div className="ml-[25%] w-[75%] p-4 overflow-auto h-full">
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

export default MyHomestaysPage;
