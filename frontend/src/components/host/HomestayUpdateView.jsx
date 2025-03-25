import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import GeneralInfo from "./HomestayUpdate/BasicInfo";
import AmenitiesInfo from "./HomestayUpdate/AmenitiesInfo";
import AddressInfor from "./HomestayUpdate/AddressInfor";
import Images from "./HomestayUpdate/Images";

const HOMESTAY_API_URL = "host/homestays/";

const HomestayUpdateView = ({ id, onDelete }) => {
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


    // Load dữ liệu chi tiết homestay
  useEffect(() => {
    const fetchHomestay = async () => {
      console.log("fetchHomestay");
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${HOMESTAY_API_URL}${id}/`);
        setHomestay(res.data);
      } catch (error) {
        console.error("Error fetching homestay:", error);
        setError("Không thể tải thông tin homestay. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHomestay();
    }
  }, [id]);


  const handleUpdate = (updatedData) => {
    setHomestay(updatedData);
  };



  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/host/homestays/${id}/`);
      alert("Xóa homestay thành công");
      onDelete();
    } catch (error) {
      console.error("Error deleting homestay:", error);
      alert("Không thể xóa homestay. Vui lòng thử lại.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!homestay) {
    return (
      <div className="text-center py-8 text-xl">
        Không tìm thấy thông tin homestay
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-xl space-y-8">
    <div
      className="border-b border-gray-200 pb-6 bg-cover bg-center bg-no-repeat min-h-[300px] flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: `url(${ homestay.images?.[0]?.image || "http://sv.dut.udn.vn/Styles/images/SlideShow01.png"})`
      }}
    >
      <h1 className="text-3xl md:text-4xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
        {homestay.name || "Tên Homestay"}
      </h1>
      <p className="text-center text-gray-300 mt-2 bg-black bg-opacity-50 px-3 py-1 rounded-md">
        Homestay ID: {id}
      </p>
    </div>

      <GeneralInfo homestay={homestay} onUpdate={handleUpdate} />
      <Images homestay={homestay} onUpdate={handleUpdate} />
      <AddressInfor homestay={homestay} onUpdate={handleUpdate} />
      <AmenitiesInfo homestay={homestay} onUpdate={handleUpdate} />

        
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Bạn có chắc chắn muốn xóa homestay này? Hành động này không thể hoàn tác."
                )
              ) {
                handleDelete();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md shadow transition-colors"
          >
            Xóa Homestay
          </button>
        </div>
      </div>
      
    </div>
  );

};

export default HomestayUpdateView;





