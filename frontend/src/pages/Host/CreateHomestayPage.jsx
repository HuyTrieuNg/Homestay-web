import React from "react";
import HomestayCreate from "@components/host/HomestayCreate";
import Header from "@components/host/Header";

function HostCreateHomestayPage(){
  return (
    <div>
        {/* Header */}
        <div className="fixed top-0 left-0 w-full h-16 z-50">
            <Header />
        </div>
        <div className="mt-16">
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

            {/* Form thêm mới homestay */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
                Thêm mới Homestay
            </h1>
            <HomestayCreate/>
            </div>
        </div>
        
        </div>
    </div>
  );
}

export default HostCreateHomestayPage;
