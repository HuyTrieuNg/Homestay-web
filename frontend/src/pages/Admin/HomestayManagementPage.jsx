import React from "react";
import HomestayListView from "@components/admin/HomestayListView";
import Header from "@components/admin/Header";

const HomestayManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <HomestayListView />
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>© 2025 Homestay Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomestayManagementPage;
