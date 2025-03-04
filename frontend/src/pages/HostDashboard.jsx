// src/pages/Dashboard.jsx
import { useState } from "react";
import LeftSidebar from "../components/host/Sidebar_host";
import HomestayDetail from "../components/host/HomestayDetail";

function Dashboard() {
  const [selectedHomestayId, setSelectedHomestayId] = useState(null);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <LeftSidebar onSelectHomestay={setSelectedHomestayId} />
      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4">
        {selectedHomestayId ? (
          <HomestayDetail id={selectedHomestayId} />
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
