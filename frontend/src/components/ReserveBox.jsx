import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DateRangePicker from "./DateRangePicker";
import useBookingLogic from "@/hooks/useBookingLogic";
import BookingGuestPicker from "./BookingGuestPicker";
import PropTypes from "prop-types";

const ReserveBox = ({ basePrice }) => {
  const {
    range,
    setRange,
    unavailableDates,
    calculateNights,
    calculateTotalPrice,
  } = useBookingLogic(basePrice);

  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const subtotal = calculateTotalPrice();
  const serviceFee = 200;
  const total = subtotal + serviceFee;

  // Hàm format tiền tệ
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat("vi-VN").format(amount);
  // };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const id = useParams();
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!range.start || !range.end) {
      alert("Vui lòng chọn ngày trước khi đặt phòng!");
      return;
    }

    const startDate = range.start.toISOString().split("T")[0];
    const endDate = range.end.toISOString().split("T")[0];

    navigate(
      `/booking?id=${id}&startDate=${startDate}&endDate=${endDate}&guests=${
        guests.adults + guests.children
      }`
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        Giá: {formatCurrency(basePrice)} / đêm
      </h2>
      <div className="mb-4 border rounded-lg p-2">
        <DateRangePicker
          onSelectRange={setRange}
          unavailableDates={unavailableDates}
        />
      </div>
      <div className="mb-4">
        <BookingGuestPicker
          isDropdown={true}
          guests={guests}
          setGuests={setGuests}
        />
      </div>

      <button
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        onClick={handleBooking}
      >
        Đặt phòng
      </button>
      <div className="space-y-3 px-2 mt-4">
        <div className="flex justify-between items-center">
          <span className="underline">
            {formatCurrency(basePrice)} x {calculateNights()} đêm
          </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="underline">Phí dịch vụ</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-semibold">
          <span>Tổng trước thuế</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

ReserveBox.defaultProps = {
  basePrice: 0,
};

ReserveBox.propTypes = {
  basePrice: PropTypes.number,
};

export default ReserveBox;
