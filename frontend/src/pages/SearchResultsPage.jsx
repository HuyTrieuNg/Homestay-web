import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HomestayCard from "../components/HomestayCard";
import { Home } from "lucide-react";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchParams } = location.state || { results: [], searchParams: {} };

  if (!location.state) {
    // Nếu không có state (người dùng truy cập trực tiếp URL), chuyển về trang chủ
    navigate('/');
    return null;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header với nút về trang chủ */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Home size={20} />
            <span>Về trang chủ</span>
          </button>
        </div>

        {/* Hiển thị thông tin tìm kiếm */}
        <div className="mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">Địa điểm:</span> {searchParams.address}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Ngày nhận phòng:</span> {searchParams.start_date}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Ngày trả phòng:</span> {searchParams.end_date}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Số khách:</span> {searchParams.guests}
            </p>
          </div>
        </div>

        {/* Hiển thị kết quả tìm kiếm */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((homestay) => (
              <HomestayCard key={homestay.id} homestay={homestay} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg mb-4">
              Không tìm thấy homestay phù hợp với tiêu chí tìm kiếm.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Tìm kiếm lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 