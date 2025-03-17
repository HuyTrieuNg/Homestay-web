import { useState } from "react";
import DateRangePicker from "./DateRangePicker";

const ReserveBox = () => {
  // State để lưu giữ giá trị ngày nhận và trả phòng nếu cần để tính toán
  const [range, setRange] = useState({ start: null, end: null });

  const handleDateRangeChange = ({ start, end }) => {
    setRange({ start, end });
  };

  // Tính số đêm
  const calculateNights = () => {
    const { start, end } = range;
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const pricePerNight = 3668286;
  const subtotal = pricePerNight * nights;
  const serviceFee = 2589387;
  const total = subtotal + serviceFee;

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-2">Giá: đ10.130.897 / đêm</h2>
      <div className="flex justify-between items-center mb-4 border rounded-lg p-2">
        <DateRangePicker onSelectRange={handleDateRangeChange} />
      </div>

      {/* Số khách */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Khách</p>
        <input
          type="number"
          min="1"
          placeholder="1 khách"
          className="w-full bg-transparent outline-none text-gray-800 border rounded-lg p-2"
        />
      </div>

      <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
        Đặt phòng
      </button>
      <div className="space-y-3 px-2 mt-4">
        <div className="flex justify-between items-center">
          <span className="underline">
            đ{formatCurrency(pricePerNight)} x {nights} đêm
          </span>
          <span>đ{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="underline">Phí dịch vụ</span>
          <span>đ{formatCurrency(serviceFee)}</span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-semibold">
          <span>Tổng trước thuế</span>
          <span>đ{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReserveBox;
