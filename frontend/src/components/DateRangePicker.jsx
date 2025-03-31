import { useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, addDays, isSameDay } from "date-fns";
import { PropTypes } from "prop-types";

const DateRangePicker = ({
  onSelectRange,
  initialStart,
  initialEnd,
  unavailableDates,
}) => {
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const parsedUnavailableDates = (unavailableDates || []).map((date) =>
    parseISO(date)
  );

  const [start, setStart] = useState(normalizeDate(initialStart || new Date()));
  const [end, setEnd] = useState(
    initialEnd
      ? normalizeDate(initialEnd)
      : normalizeDate(new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000))
  );

  const findNextAvailableDate = useCallback(
    (date) => {
      let newDate = normalizeDate(date);
      while (
        parsedUnavailableDates.some((d) => d.getTime() === newDate.getTime())
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = format(date, "yyyy-MM-dd");
    return date < today || unavailableDates?.includes(formattedDate);
  };

  const modifiers = {
    selected: [start, end],
    inRange: inRangeModifier,
    unavailable: (date) =>
      unavailableDates?.includes(format(date, "yyyy-MM-dd")),
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
    const normalizedEnd = normalizeDate(end);

    setStart(normalizedDate);

    let newEnd = normalizedEnd;
    const nextUnavailable = getNextUnavailableDate(normalizedDate);

    if (
      !normalizedEnd ||
      isSameDay(normalizedDate, normalizedEnd) ||
      normalizedDate > normalizedEnd ||
      (nextUnavailable && normalizedEnd >= nextUnavailable)
    ) {
      newEnd = findNextAvailableDate(addDays(normalizedDate, 1));
      setEnd(newEnd);
    }

    setStartPopoverOpen(false);
    setEndPopoverOpen(true);

    if (normalizedDate && newEnd) {
      onSelectRange && onSelectRange({ start: normalizedDate, end: newEnd });
    }
  };

  const handleEndSelect = (date) => {
    if (!date || !start) return;

    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(start);

    if (normalizedDate > normalizedStart) {
      setEnd(normalizedDate);
      setEndPopoverOpen(false);
      onSelectRange &&
        onSelectRange({ start: normalizedStart, end: normalizedDate });
    }
  };

  const isDisabledEnd = (date) => {
    if (!start) return false;

    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(start);

    const nextUnavailable = getNextUnavailableDate(normalizedStart);

    return (
      normalizedDate <= normalizedStart ||
      (nextUnavailable && normalizedDate > nextUnavailable)
    );
  };

  return (
    <div className="flex gap-4">
      {/* Popover cho ngày nhận phòng */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Nhận phòng</p>
        <Popover open={startPopoverOpen} onOpenChange={setStartPopoverOpen}>
          <PopoverTrigger className="w-full text-left bg-transparent outline-none text-gray-800">
            {start ? format(start, "dd/MM/yyyy") : "Chọn ngày"}
          </PopoverTrigger>
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={start}
              onSelect={handleStartSelect}
              disabled={isDateDisabled}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              month={start}
              onMonthChange={() => {}}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="border-l h-8"></div>
      {/* Popover cho ngày trả phòng */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Trả phòng</p>
        <Popover open={endPopoverOpen} onOpenChange={setEndPopoverOpen}>
          <PopoverTrigger className="w-full text-left bg-transparent outline-none text-gray-800">
            {end ? format(end, "dd/MM/yyyy") : "Chọn ngày"}
          </PopoverTrigger>
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={end}
              onSelect={handleEndSelect}
              disabled={(date) => isDateDisabled(date) || isDisabledEnd(date)}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              month={end}
              onMonthChange={() => {}}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

DateRangePicker.defaultProps = {
  unavailableDates: [],
};

DateRangePicker.propTypes = {
  onSelectRange: PropTypes.func,
  initialStart: PropTypes.instanceOf(Date),
  initialEnd: PropTypes.instanceOf(Date),
  unavailableDates: PropTypes.arrayOf(PropTypes.string),
};

export default DateRangePicker;
