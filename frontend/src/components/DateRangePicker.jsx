import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import PropTypes from "prop-types";

const DateRangePicker = ({ onSelectRange, initialStart, initialEnd }) => {
  const [start, setStart] = useState(initialStart || null);
  const [end, setEnd] = useState(initialEnd || null);

  const handleStartSelect = (date) => {
    setStart(date);
    if (end && date > end) {
      setEnd(null);
      onSelectRange && onSelectRange({ start: date, end: null });
    } else {
      onSelectRange && onSelectRange({ start: date, end });
    }
  };

  const handleEndSelect = (date) => {
    if (!start || date >= start) {
      setEnd(date);
      onSelectRange && onSelectRange({ start, end: date });
    }
  };

  const inRangeModifier = (date) => {
    if (!start || !end) return false;
    return date > start && date < end;
  };

  const modifiers = {
    selected: [start, end],
    inRange: inRangeModifier,
  };

  const modifiersClassNames = {
    inRange: "bg-primary/10",
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
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
          </PopoverContent>
        </Popover>
      </div>

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
              disabled={(date) => start && date < start}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

DateRangePicker.propTypes = {
  onSelectRange: PropTypes.func,
  initialStart: PropTypes.instanceOf(Date),
  initialEnd: PropTypes.instanceOf(Date),
};

export default DateRangePicker;
