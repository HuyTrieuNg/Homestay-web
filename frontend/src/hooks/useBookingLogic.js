import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const useBookingLogic = (basePrice) => {
  const [range, setRange] = useState({ start: null, end: null });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [datePrices, setDatePrices] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`homestays/booking/${id}/unavailable-dates`)
      .then((response) => {
        setUnavailableDates(response.data.unavailable_dates || []);
      })
      .catch(console.error);

    axiosInstance
      .get(`homestays/booking/${id}/prices`)
      .then((response) => {
        setDatePrices(response.data.price_map || {});
      })
      .catch(console.error);
  }, [id]);

  const calculateNights = () => {
    const { start, end } = range;
    if (!start || !end) return 0;
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const { start, end } = range;
    if (!start || !end) return 0;

    let total = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      total += datePrices[formattedDate] || basePrice;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return total;
  };

  return {
    range,
    setRange,
    unavailableDates,
    calculateNights,
    calculateTotalPrice,
  };
};

export default useBookingLogic;
