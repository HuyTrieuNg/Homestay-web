import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/NavBar";
import { format } from "date-fns";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { CheckCircle, Calendar, Users, MessageCircle, Home } from "lucide-react";

function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const homestay = location.state?.homestay;
  const total = location.state?.total;
  const numNights = location.state?.numNights;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format ngày nếu là object Date
  const formatDate = (d) => {
    if (!d) return "";
    if (typeof d === "string") return d;
    try {
      return format(d, "dd/MM/yyyy");
    } catch {
      return d.toString();
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(
        `homestays/booking/${booking.id}/`,
        {
          checkin_date: format(booking.checkInDate, "yyyy-MM-dd"),
          checkout_date: format(booking.checkOutDate, "yyyy-MM-dd"),
          adults: booking.numberOfAdults,
          children: booking.numberOfChildren,
          pets: booking.numberOfPets,
          currency: "USD",
          note: booking.note,
        }
      );
      navigate("/booking/success");
    } catch (err) {
      setError("Đặt phòng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!booking || !homestay) {
    return <div className="p-8">Không có dữ liệu đặt phòng.</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh] py-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
          <div className="flex flex-col items-center mb-6">
            <CheckCircle className="w-14 h-14 text-[#FF385C] mb-2" />
            <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">Xác nhận đặt phòng</h1>
            <p className="text-gray-500 text-center">Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt phòng.</p>
          </div>
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-[#FF385C]" />
              <span className="font-semibold text-lg text-gray-800">{homestay.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 text-base">{[
                homestay.address,
                homestay.province?.name,
                homestay.district?.name,
                homestay.commune?.name,
              ].filter(Boolean).join(", ")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)} <span className="ml-2 text-gray-500">({numNights} đêm)</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{booking.numberOfAdults} người lớn, {booking.numberOfChildren} trẻ em, {booking.numberOfPets} thú cưng</span>
            </div>
            {booking.note && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Ghi chú: {booking.note}</span>
              </div>
            )}
          </div>
          <div className="mb-8 flex items-center justify-between border-t pt-6">
            <span className="text-xl font-semibold text-gray-800">Tổng tiền</span>
            <span className="text-2xl font-bold text-[#FF385C]">{total} USD</span>
          </div>
          {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
          <div className="flex gap-4 justify-center mt-2">
            <button
              className="bg-white border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Quay lại
            </button>
            <button
              className="bg-[#FF385C] text-white px-8 py-2 rounded-lg font-semibold shadow-lg hover:bg-[#e11d48] transition text-lg"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Đang xác nhận..." : "Xác nhận đặt phòng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmPage;
