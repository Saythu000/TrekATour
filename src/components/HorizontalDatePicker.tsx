import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalDatePickerProps {
  availableDates: Date[];
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

const HorizontalDatePicker = ({ availableDates, selectedDate, onDateSelect }: HorizontalDatePickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Generate next 60 days from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const allDates = generateDates();

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return { day, month, weekday };
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Select Date
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred travel date from available options
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background shadow-md"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Right scroll button */}
          {canScrollRight && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background shadow-md"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Scrollable date container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allDates.map((date, index) => {
              const { day, month, weekday } = formatDate(date);
              const available = isDateAvailable(date);
              const selected = isDateSelected(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={cn(
                    "flex-shrink-0 cursor-pointer transition-all duration-200 rounded-lg border-2 p-3 min-w-[70px]",
                    "hover:shadow-md hover:scale-105",
                    {
                      "border-primary bg-primary text-primary-foreground shadow-lg": selected,
                      "border-green-200 bg-green-50 hover:border-green-300": available && !selected,
                      "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50": !available,
                      "ring-2 ring-blue-200": isToday && !selected
                    }
                  )}
                  onClick={() => available && onDateSelect(date)}
                >
                  <div className="text-center">
                    <div className={cn(
                      "text-xs font-medium mb-1",
                      selected ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {weekday}
                    </div>
                    <div className={cn(
                      "text-lg font-bold mb-1",
                      selected ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {day}
                    </div>
                    <div className={cn(
                      "text-xs",
                      selected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {month}
                    </div>
                    
                    {available && (
                      <div className={cn(
                        "w-2 h-2 rounded-full mx-auto mt-2",
                        selected ? "bg-primary-foreground" : "bg-green-500"
                      )} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date display */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Selected Date</p>
            <p className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}

        {/* Available dates info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {availableDates.length} available dates • 
            <span className="text-green-600 ml-1">Green dates are available</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorizontalDatePicker;
