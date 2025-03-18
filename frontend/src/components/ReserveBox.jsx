import { useState, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";

const ReserveBox = ({ basePrice }) => {
  const [range, setRange] = useState({ start: null, end: null });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [datePrices, setDatePrices] = useState({});
  const { id } = useParams();

  const handleDateRangeChange = ({ start, end }) => {
    setRange({ start, end });
  };

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`homestays/booking/${id}/unavailable-dates`)
      .then((response) => {
        if (Array.isArray(response.data.unavailable_dates)) {
          setUnavailableDates(response.data.unavailable_dates);
        } else {
          console.error("Invalid data format:", response.data);
          setUnavailableDates([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching unavailable dates:", error);
      });

    axiosInstance
      .get(`homestays/booking/${id}/prices`)
      .then((response) => {
        if (typeof response.data.price_map === "object") {
          setDatePrices(response.data.price_map);
        } else {
          console.error("Invalid data format:", response.data);
          setDatePrices({});
        }
      })
      .catch((error) => {
        console.error("Error fetching prices:", error);
      });
  }, [id]);

  const calculateNights = () => {
    const { start, end } = range;
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  const calculateTotalPrice = () => {
    const { start, end } = range;
    if (!start || !end) return 0;

    let total = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      total += datePrices[formattedDate] || 0;
      currentDate.setDate(currentDate.getDate() + 1);
      console.log("Date:", formattedDate, "Price:", datePrices[formattedDate]);
    }
    console.log("Total price:", total);
    return total;
  };

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

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        Giá: {formatCurrency(basePrice)} / đêm
      </h2>
      <div className="mb-4 border rounded-lg p-2">
        <DateRangePicker
          onSelectRange={handleDateRangeChange}
          unavailableDates={unavailableDates}
        />
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
            {formatCurrency(basePrice)} x {nights} đêm
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
