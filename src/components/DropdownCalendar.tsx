import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface DropdownCalendarProps {
  availableDates: Date[];
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

const DropdownCalendar = ({ availableDates, selectedDate, onDateSelect }: DropdownCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="relative">
      {/* Calendar Trigger */}
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-orange-400 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                {selectedDate ? formatDate(selectedDate) : "Select Date"}
              </div>
              <div className="text-xs text-gray-500">
                {availableDates.length} dates available
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Calendar */}
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transition-all duration-200 ${
          isOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-2'
        }`}>
          <div className="p-4">
            <div className="text-sm font-medium text-gray-900 mb-3">Available Dates</div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableDates.length > 0 ? (
                availableDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onDateSelect(date);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{formatDate(date)}</div>
                    <div className="text-xs text-gray-500">
                      {format(date, "EEEE")}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <div className="text-sm">No dates available</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownCalendar;
