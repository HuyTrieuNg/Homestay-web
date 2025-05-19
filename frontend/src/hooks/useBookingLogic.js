import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { format, addDays } from "date-fns";
import { useSearchParams } from "react-router-dom";

const useBookingLogic = (initialStart, initialEnd, basePrice) => {
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const startDate = normalizeDate(initialStart || new Date());
  const endDate = initialEnd
    ? normalizeDate(initialEnd)
    : normalizeDate(addDays(startDate, 5));

  const [range, setRange] = useState({
    start: startDate,
    end: endDate,
  });

  const [unavailableDates, setUnavailableDates] = useState([]);
  const [datePrices, setDatePrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [unavailableDatesResponse, pricesResponse] = await Promise.all([
          axiosInstance.get(`homestays/booking/${id}/unavailable-dates`),
          axiosInstance.get(`homestays/booking/${id}/prices`)
        ]);

        setUnavailableDates(unavailableDatesResponse.data.unavailable_dates || []);
        setDatePrices(pricesResponse.data.price_map || {});
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError(err.response?.data?.message || 'Failed to fetch booking data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      setUnavailableDates([]);
      setDatePrices({});
      setError(null);
    };
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
      total += Number(datePrices[formattedDate] || basePrice);
      currentDate = addDays(currentDate, 1);
    }
    return total;
  }, [range, datePrices, basePrice]);

  return {
    range,
    setRange,
    unavailableDates,
    calculateNights,
    calculateSubTotalPrice,
    isLoading,
    error,
  };
};

export default useBookingLogic;
