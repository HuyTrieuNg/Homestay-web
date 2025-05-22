import { useNavigate } from "react-router-dom";
import Navbar from "@/components/NavBar";
import { CheckCircle } from "lucide-react";

function BookingSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 mt-24 text-center border border-gray-100 flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-4xl font-bold text-green-600 mb-4">Đặt phòng thành công!</h1>
        <p className="text-lg text-gray-700 mb-8">Cảm ơn bạn đã đặt phòng.<br/>Chúng tôi đã gửi xác nhận đến email của bạn.</p>
        <button
          className="bg-[#FF385C] text-white px-10 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-[#e11d48] transition"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}

export default BookingSuccessPage;
