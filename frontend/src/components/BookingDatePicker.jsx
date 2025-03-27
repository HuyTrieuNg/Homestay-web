import useBookingLogic from "@/hooks/useBookingLogic";
import DateRangePicker from "@components/DateRangePicker";
import PropTypes from "prop-types";
import { useEffect } from "react";

const BookingDatePicker = ({
  initialStart,
  initialEnd,
  isModalOpen,
  setIsModalOpen,
  basePrice,
  setNumNights,
  setSubTotalPrice,
}) => {
  const { range, setRange, calculateNights, calculateSubTotalPrice } =
    useBookingLogic(initialStart, initialEnd, basePrice);
  useEffect(() => {
    setNumNights(calculateNights());
    setSubTotalPrice(calculateSubTotalPrice());
  }, [
    range,
    setNumNights,
    setSubTotalPrice,
    calculateNights,
    calculateSubTotalPrice,
  ]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold mb-4">Chuyến đi của bạn</h1>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold">Ngày</p>
            <p className="text-gray-700">
              {range.start
                ? range.start.toLocaleDateString("vi-VN")
                : "Chưa chọn"}{" "}
              -{range.end ? range.end.toLocaleDateString("vi-VN") : "Chưa chọn"}
            </p>
          </div>
          <button
            className="bg-white text-black px-4 py-2 rounded-lg border cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50 pb-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Chọn ngày</h2>

            <DateRangePicker
              onSelectRange={setRange}
              initialStart={range.start}
              initialEnd={range.end}
            />

            <div className="flex justify-center gap-7 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-[#FF385C] text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BookingDatePicker.propTypes = {
  initialStart: PropTypes.instanceOf(Date),
  initialEnd: PropTypes.instanceOf(Date),
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  basePrice: PropTypes.number,
  setNumNights: PropTypes.func,
  setSubTotalPrice: PropTypes.func,
};

export default BookingDatePicker;
