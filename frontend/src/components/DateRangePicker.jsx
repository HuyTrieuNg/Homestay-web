import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { PropTypes } from "prop-types";

const DateRangePicker = ({
  onSelectRange,
  initialStart,
  initialEnd,
  unavailableDates,
}) => {
  const [start, setStart] = useState(initialStart || new Date());
  const [end, setEnd] = useState(
    initialEnd ||
      new Date(new Date(start).setDate(new Date(start).getDate() + 5))
  );

  const parsedUnavailableDates = (unavailableDates || []).map((date) =>
    parseISO(date)
  );

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

  const getNextUnavailableDate = (startDate) => {
    return parsedUnavailableDates.find((date) => date > startDate);
  };

  const handleStartSelect = (date) => {
    setStart(date);
    const nextUnavailable = getNextUnavailableDate(date);
    if (end && (date > end || (nextUnavailable && end > nextUnavailable))) {
      setEnd(null);
      onSelectRange && onSelectRange({ start: date, end: null });
    } else {
      onSelectRange && onSelectRange({ start: date, end });
    }
  };

  const isDisabledEnd = (date) => {
    if (!start) return false;

    const nextUnavailable = getNextUnavailableDate(start);
    return date < start || (nextUnavailable && date > nextUnavailable);
  };

  const handleEndSelect = (date) => {
    if (start && date > start) {
      setEnd(date);
      onSelectRange && onSelectRange({ start, end: date });
    }
  };

  return (
    <div className="flex gap-4">
      {/* Popover cho ngày nhận phòng */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Nhận phòng</p>
        <Popover>
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
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="border-l h-8"></div>
      {/* Popover cho ngày trả phòng */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-600">Trả phòng</p>
        <Popover>
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
