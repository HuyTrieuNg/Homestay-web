import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const useBookingLogic = (initialStart, initialEnd, basePrice) => {
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const startDate = normalizeDate(initialStart || new Date());
  const endDate = initialEnd
    ? normalizeDate(initialEnd)
    : normalizeDate(new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000));

  const [range, setRange] = useState({
    start: startDate,
    end: endDate,
  });

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

  const calculateNights = useCallback(() => {
    const { start, end } = range;
    if (!start || !end) return 0;
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  }, [range]);

  const calculateSubTotalPrice = useCallback(() => {
    const { start, end } = range;
    if (!start || !end || start >= end) return 0;

    let total = 0;
    let currentDate = new Date(start);

    while (currentDate < end) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      total += datePrices[formattedDate] || basePrice;
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return total;
  }, [range, datePrices, basePrice]);

  return {
    range,
    setRange,
    unavailableDates,
    calculateNights,
    calculateSubTotalPrice,
  };
};

export default useBookingLogic;
