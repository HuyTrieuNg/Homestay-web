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
  
  const dayColorClasses = {
    0: "bg-red-100 text-red-800", // Sunday (CN)
    1: "bg-yellow-100 text-yellow-800", // Monday (T2)
    2: "bg-green-100 text-green-800", // Tuesday (T3)
    3: "bg-blue-100 text-blue-800", // Wednesday (T4)
    4: "bg-purple-100 text-purple-800", // Thursday (T5)
    5: "bg-pink-100 text-pink-800", // Friday (T6)
    6: "bg-orange-100 text-orange-800", // Saturday (T7)
  };

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
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 relative">
      {/* Calendar Header with Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-1 font-medium shadow-sm"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tháng trước
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {currentMonth.toLocaleString("vi-VN", { month: "long", year: "numeric" })}
        </h2>
        <button
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-1 font-medium shadow-sm"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        >
          Tháng sau
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Legend */}
      <div className="flex gap-4 mb-4 justify-end">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-sm text-gray-600">Có sẵn</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Đã đặt</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Khóa</span>
        </div>
      </div>

      {/* Weekday Headers with unique colors */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold mb-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`p-2 rounded-lg ${dayColorClasses[index]}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid with original styling */}
      <div className="grid grid-cols-7 gap-2">
        {getMonthDays(currentMonth).map((day, index) => {
          if (!day) return <div key={index} className="p-4 rounded-lg bg-gray-50"></div>;

          const availability = getAvailability(day);
          const status = availability ? availability.status : "available";
          const price = availability ? availability.price : basePrice;
          const booking = availability?.booking;

          let bgColor = "bg-gray-200 hover:bg-gray-300";
          let textColor = "text-gray-800";
          let decoration = "";
          let opacity = day < today ? "opacity-50" : "opacity-100";

          if (status === "available") bgColor = "bg-gray-200 hover:bg-gray-300";
          if (status === "booked") bgColor = "bg-green-500 hover:bg-green-600 text-white";
          if (status === "blocked") {
            bgColor = "bg-red-500 hover:bg-red-600 text-white";
            decoration = "line-through";
          }

          const isToday = day.toLocaleDateString("en-CA") === todayStr;
          const borderStyle = isToday ? "ring-2 ring-offset-2 ring-indigo-500" : "";

          return (
            <div
              key={index}
              className={`p-2 mt-1 text-center cursor-pointer rounded-lg transition-all duration-200 transform hover:scale-105 ${bgColor} ${borderStyle} ${textColor} ${opacity} shadow-sm`}
              onClick={() => {
                setSelectedDate(availability || { date: day.toLocaleDateString("en-CA"), price, status, booking });
                setShowPopup(true);
              }}
            >
              <div className={`text-lg font-medium ${decoration}`}>{day.getDate()}</div>
              {price && (
                <div className="text-sm font-bold mt-1">
                  {price !== "N/A" ? `${price}đ` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Popup */}
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
