import { useState } from "react";
import Sidebar from "@components/host/Sidebar";
import Header from "@components/host/Header";
import Calendar from "@/components/host/Calendar";

function HostCalendarPage() {
  const [selectedHomestayId, setSelectedHomestayId] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="fixed top-0 left-0 w-full h-16 z-50">
            <Header />
          </div>
    
          {/* Main Content */}
          <div className="flex mt-16 h-[calc(100vh-64px)]">
            {/* Sidebar - Cố định bên trái */}
            <div className="fixed top-16 left-0 w-1/4 h-[calc(100vh-64px)] bg-gray-100 border-r shadow-lg overflow-auto">
              <Sidebar 
                onSelectHomestay={setSelectedHomestayId} 
              />
            </div>
    
            {/* Nội dung chính */}
            <div className="ml-[25%] w-[75%] p-4 overflow-auto h-full">
              {selectedHomestayId ? (
                <Calendar 
                  id={selectedHomestayId}
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

export default HostCalendarPage;