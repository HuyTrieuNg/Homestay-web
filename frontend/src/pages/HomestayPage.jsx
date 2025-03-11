import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import AmenityList from "../components/AmenityList";

function HomestayPage() {
  const { id } = useParams();
  const [homestay, setHomestay] = useState();

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`homestays/${id}`)
        .then((response) => {
          console.log("Homestay data:", response.data);
          setHomestay(response.data);
        })
        .catch((error) => {
          console.error("Error fetching homestay details:", error);
        });
    }
  }, [id]);

  if (!homestay) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-8">
      {/* ========== Hàng 1: Tên + Ảnh ========== */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">{homestay.name}</h1>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
          <p>{homestay.address}</p>
          <span className="mx-2">•</span>
          <p>4.89 · 18 đánh giá</p>
        </div>

        {homestay.images && homestay.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {homestay.images.slice(0, 5).map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={homestay.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {/* Nút Hiển thị tất cả ảnh (nếu > 5) */}
                {index === 4 && homestay.images.length > 5 && (
                  <button className="absolute inset-0 bg-black bg-opacity-30 text-white font-semibold flex items-center justify-center text-lg rounded-lg hover:bg-opacity-40 transition">
                    Hiển thị tất cả ảnh
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== Hàng 2: 2 cột ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Cột trái: Chi tiết Homestay */}
        <div>
          <p className="text-lg mb-4 text-gray-700">
            8 khách · 4 phòng ngủ · 6 giường · 1 phòng tắm
          </p>
          <p className="mb-8 text-gray-700 leading-relaxed">
            {homestay.description}
          </p>

          {/* Tiện ích */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Nơi này có những gì cho bạn
            </h2>
            <AmenityList amenities={homestay.amenities} />
          </div>
        </div>

        {/* Cột phải: Box đặt phòng */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Giá: đ10.130.897 / đêm</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Nhận phòng</p>
              <p>20/3/2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trả phòng</p>
              <p>25/3/2025</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Khách</p>
            <p>1 khách</p>
          </div>
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
            Đặt phòng
          </button>
        </div>
      </div>

      {/* ========== Hàng 3: Đánh giá (thêm sau) ========== */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h2>
        {/* Bạn sẽ thêm danh sách đánh giá ở đây */}
        <p className="text-gray-500">Chưa có đánh giá nào</p>
      </div>
    </div>
  );
}

export default HomestayPage;
