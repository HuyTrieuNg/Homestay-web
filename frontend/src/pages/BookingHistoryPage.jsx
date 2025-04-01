import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(
          "/homestays/booking/mybookings"
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt phòng:", error);
        setError("Không thể tải danh sách đặt phòng.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const viewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500">
        Đang tải danh sách đặt phòng...
      </p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => window.history.back()}
        className="text-black mb-4 flex items-center text-3xl font-semibold cursor-pointer"
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
        <span>Chuyến đi của bạn</span>
      </button>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600">Bạn chưa có chuyến đi nào.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            Bắt đầu khám phá
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start border border-gray-300 rounded-lg p-4 hover:border-black transition-colors"
            >
              {/* Hình ảnh Homestay */}
              <div className="w-40 h-40 flex-shrink-0">
                {booking.homestay.images &&
                booking.homestay.images.length > 0 ? (
                  <img
                    src={booking.homestay.images[0]}
                    alt="Homestay"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500">Không có ảnh</p>
                  </div>
                )}
              </div>

              {/* Thông tin chính */}
              <div className="ml-6 flex-1">
                <h3 className="text-xl font-semibold">
                  {booking.homestay.name}
                </h3>
                <p className="text-gray-600">
                  {booking.checkin_date} - {booking.checkout_date}
                </p>
                <p className="text-gray-500">Số khách: {booking.guests}</p>
                <p className="text-gray-500">Note: {booking.note}</p>
                <p className="text-gray-700 font-medium">
                  Tổng tiền: {booking.total_amount} {booking.currency}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "cancel"
                      ? "bg-gray-100 text-gray-800"
                      : booking.status === "reject"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Nút hành động */}
              <div className="ml-4">
                <button
                  onClick={() => viewDetails(booking.id)}
                  className="text-black border border-black px-4 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
