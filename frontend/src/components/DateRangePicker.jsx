import { useCallback, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, addDays, isSameDay, differenceInDays } from "date-fns";
import { PropTypes } from "prop-types";

const DateRangePicker = ({
  onSelectRange,
  initialStart,
  initialEnd,
  unavailableDates,
  minNights = 1,
  maxNights = 30,
}) => {
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const parsedUnavailableDates = (unavailableDates || []).map((date) =>
    parseISO(date)
  );

  // Tìm ngày bắt đầu hợp lệ đầu tiên
  const findFirstValidStartDate = useCallback(() => {
    const today = normalizeDate(new Date());
    let currentDate = today;
    
    // Kiểm tra xem ngày hiện tại có phải là ngày bận không
    while (parsedUnavailableDates.some(d => isSameDay(d, currentDate))) {
      currentDate = addDays(currentDate, 1);
    }
    return currentDate;
  }, [parsedUnavailableDates]);

  // Tìm ngày kết thúc hợp lệ đầu tiên sau ngày bắt đầu
  const findFirstValidEndDate = useCallback((startDate) => {
    if (!startDate) return null;
    
    let currentDate = addDays(startDate, minNights);
    
    // Kiểm tra xem ngày kết thúc có phải là ngày bận không
    while (parsedUnavailableDates.some(d => isSameDay(d, currentDate))) {
      currentDate = addDays(currentDate, 1);
    }
    return currentDate;
  }, [parsedUnavailableDates, minNights]);

  // Kiểm tra và điều chỉnh ngày khởi tạo
  const getValidInitialDates = useCallback(() => {
    let startDate = initialStart ? normalizeDate(initialStart) : findFirstValidStartDate();
    let endDate = initialEnd ? normalizeDate(initialEnd) : null;

    // Nếu ngày bắt đầu là ngày bận, tìm ngày hợp lệ tiếp theo
    if (parsedUnavailableDates.some(d => isSameDay(d, startDate))) {
      startDate = findFirstValidStartDate();
    }

    // Nếu không có ngày kết thúc hoặc ngày kết thúc là ngày bận
    if (!endDate || parsedUnavailableDates.some(d => isSameDay(d, endDate))) {
      endDate = findFirstValidEndDate(startDate);
    }

    // Đảm bảo khoảng cách tối thiểu giữa ngày bắt đầu và kết thúc
    if (endDate && differenceInDays(endDate, startDate) < minNights) {
      endDate = findFirstValidEndDate(startDate);
    }

    return { startDate, endDate };
  }, [initialStart, initialEnd, parsedUnavailableDates, minNights, findFirstValidStartDate, findFirstValidEndDate]);

  const { startDate: initialStartDate, endDate: initialEndDate } = getValidInitialDates();

  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);

  // Add state for managing current month in calendars
  const [startMonth, setStartMonth] = useState(start);
  const [endMonth, setEndMonth] = useState(end);

  // Call onSelectRange when component mounts with initial dates
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      onSelectRange && onSelectRange({ start: initialStartDate, end: initialEndDate });
    }
  }, []);

  const findNextAvailableDate = useCallback(
    (date) => {
      let newDate = normalizeDate(date);
      while (
        parsedUnavailableDates.some((d) => isSameDay(d, newDate))
      ) {
        newDate = addDays(newDate, 1);
      }
      return newDate;
    },
    [parsedUnavailableDates]
  );

  const getNextUnavailableDate = (startDate) => {
    return parsedUnavailableDates.find((date) => date > startDate) || null;
  };

  const inRangeModifier = (date) => {
    if (!start || !end) return false;
    return date > start && date < end;
  };

  const isDateDisabled = (date) => {
    const today = normalizeDate(new Date());
    return date < today || parsedUnavailableDates.some(d => isSameDay(d, date));
  };

  const modifiers = {
    selected: [start, end],
    inRange: inRangeModifier,
    unavailable: (date) => parsedUnavailableDates.some(d => isSameDay(d, date)),
  };

  const modifiersClassNames = {
    inRange: "bg-primary/10",
    unavailable: "line-through text-gray-400",
  };

  const [startPopoverOpen, setStartPopoverOpen] = useState(false);
  const [endPopoverOpen, setEndPopoverOpen] = useState(false);

  const handleStartSelect = (date) => {
    if (!date) return;

    const normalizedDate = normalizeDate(date);
    setStart(normalizedDate);

    // Reset end date if it's before or same as new start date
    if (!end || normalizedDate >= end) {
      const newEnd = findFirstValidEndDate(normalizedDate);
      setEnd(newEnd);
      onSelectRange && onSelectRange({ start: normalizedDate, end: newEnd });
    } else {
      onSelectRange && onSelectRange({ start: normalizedDate, end });
    }

    setStartPopoverOpen(false);
    setEndPopoverOpen(true);
  };

  const handleEndSelect = (date) => {
    if (!date || !start) return;

    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(start);
    const nights = differenceInDays(normalizedDate, normalizedStart);

    // Validate minimum and maximum nights
    if (nights < minNights) {
      const newEnd = findFirstValidEndDate(normalizedStart);
      setEnd(newEnd);
      onSelectRange && onSelectRange({ start: normalizedStart, end: newEnd });
    } else if (nights > maxNights) {
      const newEnd = addDays(normalizedStart, maxNights);
      setEnd(newEnd);
      onSelectRange && onSelectRange({ start: normalizedStart, end: newEnd });
    } else {
      setEnd(normalizedDate);
      onSelectRange && onSelectRange({ start: normalizedStart, end: normalizedDate });
    }

    setEndPopoverOpen(false);
  };

  const isDisabledEnd = (date) => {
    if (!start) return false;

    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(start);
    const nights = differenceInDays(normalizedDate, normalizedStart);

    const nextUnavailable = getNextUnavailableDate(normalizedStart);

    return (
      normalizedDate <= normalizedStart ||
      nights < minNights ||
      nights > maxNights ||
      (nextUnavailable && normalizedDate > nextUnavailable) ||
      parsedUnavailableDates.some(d => isSameDay(d, normalizedDate))
    );
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Nhận phòng</p>
        <Popover open={startPopoverOpen} onOpenChange={setStartPopoverOpen}>
          <PopoverTrigger className="w-full text-left bg-transparent outline-none text-gray-800">
            {start ? format(start, "dd/MM/yyyy") : "Chọn ngày"}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={start}
              onSelect={handleStartSelect}
              disabled={isDateDisabled}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              month={startMonth}
              onMonthChange={setStartMonth}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="border-l h-8"></div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Trả phòng</p>
        <Popover open={endPopoverOpen} onOpenChange={setEndPopoverOpen}>
          <PopoverTrigger className="w-full text-left bg-transparent outline-none text-gray-800">
            {end ? format(end, "dd/MM/yyyy") : "Chọn ngày"}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={end}
              onSelect={handleEndSelect}
              disabled={(date) => isDateDisabled(date) || isDisabledEnd(date)}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              month={endMonth}
              onMonthChange={setEndMonth}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

DateRangePicker.defaultProps = {
  unavailableDates: [],
  minNights: 1,
  maxNights: 30,
};

DateRangePicker.propTypes = {
  onSelectRange: PropTypes.func,
  initialStart: PropTypes.instanceOf(Date),
  initialEnd: PropTypes.instanceOf(Date),
  unavailableDates: PropTypes.arrayOf(PropTypes.string),
  minNights: PropTypes.number,
  maxNights: PropTypes.number,
};

export default DateRangePicker;
