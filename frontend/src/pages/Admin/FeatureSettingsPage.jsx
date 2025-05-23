import React from "react";
import PropertyTypeManager from "@components/admin/PropertyTypeManager";
import AmenityManager from "@components/admin/AmenityManager";
import Header from "@components/admin/Header";

const FeatureSettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột trái: Quản lý loại homestay */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <PropertyTypeManager />
          </div>

          {/* Cột phải: Quản lý tiện ích */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <AmenityManager />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>© 2025 Homestay Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FeatureSettingsPage;
