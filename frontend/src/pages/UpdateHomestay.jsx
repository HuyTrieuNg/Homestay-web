import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import HomestayFormComponent from "@components/host/HomestayFormComponent";

function UpdateHomestay() {
  const { id } = useParams(); // Lấy ID của homestay cần cập nhật từ URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  // Lấy dữ liệu chi tiết của homestay khi component mount hoặc id thay đổi
  useEffect(() => {
    axiosInstance
      .get(`host/homestays/${id}/`)
      .then((res) => setInitialData(res.data))
      .catch((err) =>
        console.error("Error fetching homestay detail:", err.response?.data || err)
      );
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      const response = await axiosInstance.put(`host/homestays/${id}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Homestay updated:", response.data);
      navigate("/host"); // Chuyển hướng sau khi cập nhật thành công
    } catch (error) {
      console.error("Error updating homestay:", error.response?.data || error);
    }
  };

  if (!initialData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Homestay</h1>
      <HomestayFormComponent initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}

export default UpdateHomestay;
