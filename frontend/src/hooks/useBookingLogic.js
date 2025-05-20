import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { format, addDays } from "date-fns";

const useBookingLogic = (initialStart, initialEnd, basePrice, homestayId) => {
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

  useEffect(() => {
    if (!homestayId) {
      console.log('No homestayId provided');
      return;
    }

    console.log('Fetching data for homestay:', homestayId);

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [unavailableDatesResponse, pricesResponse] = await Promise.all([
          axiosInstance.get(`homestays/booking/${homestayId}/unavailable-dates`),
          axiosInstance.get(`homestays/booking/${homestayId}/prices`)
        ]);

        console.log('Unavailable dates response:', unavailableDatesResponse.data);
        console.log('Prices response:', pricesResponse.data);

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

    return () => {
      setUnavailableDates([]);
      setDatePrices({});
      setError(null);
    };
  }, [homestayId]);

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
