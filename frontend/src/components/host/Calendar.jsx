import { useState, useEffect, useRef } from "react";
import axiosInstance from "@utils/axiosInstance";
import DayDetail from "./DayDetail";

const Calendar = ({ id }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilities, setAvailabilities] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [basePrice, setBasePrice] = useState("");

  const popupRef = useRef(null);
  
  useEffect(() => {
    setCurrentMonth(new Date());
  }, [id]);

  

  useEffect(() => {
    axiosInstance
      .get(`host/availability/${id}/`)
      .then((res) => setAvailabilities(res.data))
      .catch((err) => console.error("Lỗi tải lịch:", err));
    axiosInstance
      .get(`/host/homestays/${id}/`)
      .then((res) => setBasePrice(res.data.base_price))
      .catch((err) => console.error("Lỗi tải giá cơ bản:", err))

  }, [id]);

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let days = [];
    let startDay = firstDay.getDay();

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const getAvailability = (date) => {
    if (!availabilities) return null;
    const dateStr = date.toLocaleDateString("en-CA");
    return availabilities.find((item) => item.date === dateStr) || null;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toLocaleDateString("en-CA");

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);



  return (
    <div className="p-4 relative">
      <div className="flex justify-between mb-4">
        <button
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
        >
          ← Tháng trước
        </button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString("vi-VN", { month: "long", year: "numeric" })}
        </h2>
        <button
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        >
          Tháng sau →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        {weekDays.map((day, index) => (
          <div key={index} className="p-2 border bg-gray-300">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {getMonthDays(currentMonth).map((day, index) => {
          if (!day) return <div key={index} className="p-4 border bg-gray-100"></div>;

          const availability = getAvailability(day);
          const status = availability ? availability.status : "available";
          const price = availability ? availability.price : basePrice;
          const booking = availability ?.booking;

          let bgColor = "bg-gray-200";
          let textColor = "text-black";
          let decoration = "";
          let opacity = day < today ? "opacity-50" : "opacity-100";

          if (status === "available") bgColor = "bg-gray-200";
          if (status === "booked") bgColor = "bg-green-500 text-white";
          if (status === "blocked") {
            bgColor = "bg-red-500 text-white";
            decoration = "line-through";
          }

          const isToday = day.toLocaleDateString("en-CA") === todayStr;
          const borderStyle = isToday ? "border-4 border-black" : "border";

          return (
            <div
              key={index}
              className={`p-4 text-center cursor-pointer rounded ${bgColor} ${borderStyle} ${textColor} ${opacity}`}
              onClick={() => {
                setSelectedDate(availability || { date: day.toLocaleDateString("en-CA"), price, status, booking });
                setShowPopup(true);
              }}
            >
              <div className={decoration}>{day.getDate()}</div>
              <div className="text-sm">{price !== "N/A" ? `$${price}` : ""}</div>
            </div>
          );
        })}
      </div>

      {showPopup && (
        <div ref={popupRef}>
          <DayDetail
          id = {id}
          Date={selectedDate}
          setShowPopup={setShowPopup}
          setAvailabilities={setAvailabilities}
        />
        </div>
      )}
    </div>
  );
};

export default Calendar;
