import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import AmenityList from "../components/AmenityList";
import ReserveBox from "@/components/ReserveBox";
import HostInfo from "@/components/HostInfo";
import { ArrowLeft, Trash2, CheckCircle, Key, MessageCircle, Map as MapIcon, Tag } from "lucide-react";
import Navbar from "@/components/NavBar";
import Map from "@/components/Map";

function HomestayPage() {
  const { id } = useParams();
  const [homestay, setHomestay] = useState();
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletLoadedRef = useRef(false);

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

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/homestays/reviews/${id}/`)
        .then((response) => {
          setReviews(response.data);
          console.log("Reviews data:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [id]);

  // Initialize map when homestay data is loaded
  useEffect(() => {
    if (!homestay?.latitude || !homestay?.longitude) return;

    // Cleanup function to remove any existing map
    const cleanupMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };

    // Dynamically load Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // Function to initialize map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Clean up any existing map first
      cleanupMap();

      // Get coordinates
      const lat = parseFloat(homestay.latitude);
      const lng = parseFloat(homestay.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", { lat, lng });
        return;
      }

      // Create new map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(homestay.name)
        .openPopup();
    };

    // Load Leaflet script if not already loaded
    if (!window.L && !leafletLoadedRef.current) {
      leafletLoadedRef.current = true;
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      leafletScript.async = true;
      
      leafletScript.onload = () => {
        initializeMap();
      };
      
      document.body.appendChild(leafletScript);
    } else if (window.L) {
      // Leaflet is already loaded, initialize map
      initializeMap();
    }

    // Cleanup on component unmount
    return cleanupMap;
  }, [homestay?.latitude, homestay?.longitude]);

  if (!homestay) {
    return <p>Loading...</p>;
  }

  // Tính điểm trung bình cho từng tiêu chí
  const ratingCategories = [
    { name: "Mức độ sạch sẽ", key: "cleanliness_rating", icon: <Trash2 className="w-7 h-7" /> },
    { name: "Độ chính xác", key: "accuracy_rating", icon: <CheckCircle className="w-7 h-7" /> },
    { name: "Nhận phòng", key: "checkin_rating", icon: <Key className="w-7 h-7" /> },
    { name: "Giao tiếp", key: "communication_rating", icon: <MessageCircle className="w-7 h-7" /> },
    { name: "Vị trí", key: "location_rating", icon: <MapIcon className="w-7 h-7" /> },
    { name: "Giá trị", key: "value_rating", icon: <Tag className="w-7 h-7" /> },
  ].map((category) => ({
    name: category.name,
    score:
      reviews.length > 0
        ? (
          reviews.reduce((sum, review) => sum + review[category.key], 0) /
          reviews.length
        ).toFixed(1)
        : 0,
    icon: category.icon,
  }));

  // Tính trung bình overall_rating
  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce((sum, review) => sum + review.overall_rating, 0) /
        reviews.length
      ).toFixed(2)
      : 0;

  // Đếm số lượng đánh giá theo từng mức sao (1 đến 5) cho Xếp hạng tổng thể
  const ratingDistribution = [5, 4, 3, 2, 1].reduce((acc, star) => {
    acc[star] = reviews.filter((review) => review.overall_rating === star).length;
    return acc;
  }, {});

  // Số lượng review hiển thị ban đầu
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-8">
        {/* ========== Hàng 1: Tên + Ảnh ========== */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="text-black mb-4 flex items-center text-3xl font-bold cursor-pointer"
          >
            <svg
              className="w-6 h-6 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="ml-1 text-3xl font-bold text-gray-900">{homestay.name}</span>
          </button>
          <div className="flex flex-wrap items-center text-base text-gray-700 mb-4 font-medium">
            <p className="mr-2">
              <span className="font-semibold">Địa chỉ:</span> {[
                homestay.address,
                homestay.province?.name,
                homestay.district?.name,
                homestay.commune?.name,
              ].filter(Boolean).join(", ")}
            </p>
            <span className="mx-2">•</span>
            <p>
              <span className="font-semibold">{averageRating}</span> · {reviews.length} đánh giá
            </p>
          </div>

          {homestay.images && homestay.images.length > 0 && (
            <div className={`grid ${homestay.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-2`}>
              {/* Ảnh chính (lớn) */}
              <div className={homestay.images.length === 1 ? 'w-full' : 'md:col-span-2 lg:col-span-1'}>
                <img
                  src={homestay.images[0]}
                  alt={`${homestay.name} - Ảnh chính`}
                  className={`w-full ${homestay.images.length === 1 ? 'h-[500px]' : 'h-[400px]'} object-cover rounded-lg`}
                />
              </div>
              
              {/* Grid ảnh phụ - chỉ hiển thị khi có nhiều hơn 1 ảnh */}
              {homestay.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {homestay.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`${homestay.name} - Ảnh ${index + 2}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  {/* Nút hiển thị tất cả ảnh nếu có nhiều hơn 5 ảnh */}
                  {homestay.images.length > 5 && (
                    <div className="relative aspect-square group">
                      <img
                        src={homestay.images[4]}
                        alt={`${homestay.name} - Ảnh 5`}
                        className="w-full h-full object-cover rounded-lg brightness-75"
                      />
                      <button 
                        onClick={() => {/* Xử lý hiển thị gallery */}}
                        className="absolute inset-0 bg-black bg-opacity-40 text-white font-semibold flex items-center justify-center text-lg rounded-lg hover:bg-opacity-50 transition-all duration-200"
                      >
                        Hiển thị tất cả {homestay.images.length} ảnh
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========== Hàng 2: 2 cột ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cột trái: Chi tiết Homestay */}
          <div>
            <p className="text-lg mb-4 text-gray-800 font-semibold">
              8 khách · 4 phòng ngủ · 6 giường · 1 phòng tắm
            </p>
            <p className="mb-8 text-gray-800 leading-relaxed text-base font-normal">
              {homestay.description}
            </p>

            {/* Host Info */}
            <div className="mb-6">
              <HostInfo homestayId={homestay.id} />
            </div>

            {/* Tiện ích */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Nơi này có những gì cho bạn
              </h2>
              <AmenityList amenities={homestay.amenities} />
            </div>
          </div>
          {/* Cột phải: ReserveBox */}
          <div>
            <ReserveBox 
              basePrice={homestay.base_price} 
              homestayId={homestay.id}
              initialStart={new Date()}
              initialEnd={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            />
          </div>
        </div>

        {/* Bản đồ */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Vị trí
          </h2>
          <Map 
            latitude={homestay.latitude}
            longitude={homestay.longitude}
            title={homestay.name}
          />
        </div>

        {/* ========== Hàng 3: Đánh giá ========== */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            ★ {averageRating} · {reviews.length} đánh giá
          </h2>

          {/* Phân loại đánh giá */}
          {reviews.length > 0 && (
            <div className="flex justify-between items-stretch mb-8 divide-x divide-gray-300">
              {/* Xếp hạng tổng thể */}
              <div className="px-4 flex-1">
                <p className="text-gray-700 mb-2 text-sm">Xếp hạng tổng thể</p>
                {/* <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <span className="w-4 text-right mr-2">{star}</span>
                      <div className="w-20 bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{ width: `${(ratingDistribution[star] / reviews.length) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="space-y-0.1">  {/* Giảm khoảng cách dọc giữa các dòng */}
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center space-x-1">
                      <span className="w-4 text-left mr-1 text-xs">{star}</span> {/* Giảm margin */}
                      <div className="w-25 bg-gray-200 h-1 rounded-full"> {/* Giảm độ cao (h-1) */}
                        <div
                          className="bg-black h-1 rounded-full"
                          style={{ width: `${(ratingDistribution[star] / reviews.length) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Các danh mục đánh giá khác */}
              {ratingCategories.map((category, index) => (
                <div key={index} className="px-3 flex-1 flex flex-col items-start">
                  <div className="flex items-center mb-1">

                    <p className="text-gray-700 text-sm">{category.name}</p>
                  </div>
                  <p className="font-semibold text-xl mb-7">{category.score}</p>
                  {category.icon}
                </div>
              ))}
            </div>
          )}

          {/* Danh sách đánh giá */}
          {/* <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
          <div className="border-t pt-6 grid grid-cols-1 gap-6 mb-6">
            {displayedReviews.length > 0 ? (
              displayedReviews.map((review) => (
                <div key={review.id} className="flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <img
                        src={review.avatar_url || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{review.user}</p>
                    </div>
                  </div>
                  <p className="text-black text-sm font-semibold">
                    {Array(Math.round(review.overall_rating))
                      .fill("★")
                      .join("")}
                    {" · "}
                    {new Date(review.created_at).toLocaleDateString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {/* <p className="text-gray-700 line-clamp-4 mb-2">
                    {review.comment || "Không có nhận xét."}
                  </p> */}
                  <p className={`text-gray-700 ${expandedReviewId === review.id ? '' : 'line-clamp-4'} mb-2`}>
                    {review.comment || "Không có nhận xét."}
                  </p>
                  {review.comment && review.comment.length > 200 && (
                    <button
                      onClick={() =>
                        setExpandedReviewId(expandedReviewId === review.id ? null : review.id)
                      }
                      className="text-black text-sm font-semibold underline text-left mb-2"
                    >
                      {expandedReviewId === review.id ? "Ẩn bớt" : "Xem thêm"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">Chưa có đánh giá nào</p>
            )}
          </div>

          {/* Nút hiển thị tất cả đánh giá */}
          {/* {reviews.length > 3 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="border border-gray-300 rounded-lg px-6 py-2 font-semibold text-gray-800 hover:bg-gray-100 transition"
            >
              Hiển thị tất cả {reviews.length} đánh giá
            </button>
          )} */}
          {reviews.length > 3 && (
            <button
              className="border border-gray-300 rounded-lg px-6 py-2 font-semibold text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setShowAllReviews(!showAllReviews)}>
              {showAllReviews
                ? "Thu gọn"
                : `Hiển thị tất cả ${reviews.length} đánh giá`}

            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomestayPage;