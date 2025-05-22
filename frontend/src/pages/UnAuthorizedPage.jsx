import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 flex flex-col items-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-700 mb-8 text-lg">
          Bạn không có quyền truy cập vào trang này.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-[#FF385C] text-white font-semibold rounded-lg shadow-md hover:bg-[#e11d48] transition text-lg"
          onClick={handleBackToHome}
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
