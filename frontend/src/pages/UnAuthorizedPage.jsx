import { Link, useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-700 mb-6">
          Bạn không có quyền truy cập vào trang này.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={handleBackToHome}
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
