import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, CreditCard, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DropdownCalendar from "@/components/DropdownCalendar";
import BookingFormAdvanced from "@/components/BookingFormAdvanced";
import { AdminTrip } from "@/lib/adminStorage";

interface FloatingBookingWidgetProps {
  trip: AdminTrip;
  availableDates: Date[];
}

const FloatingBookingWidget = ({ trip, availableDates }: FloatingBookingWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden max-w-sm">
              <CardContent className="p-0">
                {/* Collapsed State */}
                {!isExpanded && (
                  <motion.div
                    className="p-4 cursor-pointer"
                    onClick={() => setIsExpanded(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Book This Trip</div>
                        <div className="text-sm text-gray-600">
                          ₹{trip.basePrice.toLocaleString()} per person
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                )}

                {/* Expanded State */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">Quick Booking</div>
                          <div className="text-sm text-gray-600">{trip.title}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsExpanded(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Date Selection */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Select Date
                        </label>
                        <DropdownCalendar
                          availableDates={availableDates}
                          selectedDate={selectedDate}
                          onDateSelect={setSelectedDate}
                        />
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <span>Base Price</span>
                          <span>₹{trip.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>Taxes & Fees</span>
                          <span>Included</span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{trip.basePrice.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Book Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setIsBookingOpen(true)}
                        disabled={!selectedDate}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>

                      <div className="text-xs text-gray-500 text-center">
                        Free cancellation up to 24 hours before trip
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
          </DialogHeader>
          <BookingFormAdvanced trip={trip} selectedDate={selectedDate} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingBookingWidget;
