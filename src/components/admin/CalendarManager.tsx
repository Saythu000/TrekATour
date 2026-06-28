import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { AdminTrip, getTripAvailableDates, updateTripSchedule } from "@/lib/adminStorage";
import { X, Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarManagerProps {
  trip: AdminTrip;
  onClose: () => void;
}

const CalendarManager = ({ trip, onClose }: CalendarManagerProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [tempDate, setTempDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    // Load existing dates for this trip
    const existingDates = getTripAvailableDates(trip.id);
    setSelectedDates(existingDates);
  }, [trip.id]);

  const handleAddDate = () => {
    if (!tempDate) return;
    
    const dateExists = selectedDates.some(date => 
      date.toDateString() === tempDate.toDateString()
    );
    
    if (!dateExists) {
      const newDates = [...selectedDates, tempDate].sort((a, b) => a.getTime() - b.getTime());
      setSelectedDates(newDates);
      setTempDate(undefined);
    }
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(date => 
      date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(newDates);
  };

  const handleSave = () => {
    updateTripSchedule(trip.id, selectedDates);
    toast({
      title: "Success",
      description: `Calendar updated for ${trip.title}`,
    });
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Manage Calendar: {trip.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select dates when this trip will be available for booking
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar for selecting dates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Add Available Dates</h3>
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={tempDate}
                  onSelect={setTempDate}
                  disabled={isDateDisabled}
                  className="rounded-md border"
                />
                <Button 
                  onClick={handleAddDate}
                  disabled={!tempDate}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Selected Date
                </Button>
              </div>
            </div>

            {/* Selected dates list */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Dates ({selectedDates.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedDates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No dates selected. Add dates from the calendar.
                  </p>
                ) : (
                  selectedDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDate(date)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const nextWeekends = [];
                  for (let i = 0; i < 8; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + (i * 7) + (6 - today.getDay())); // Next Saturdays
                    if (date > today) nextWeekends.push(date);
                  }
                  const combined = [...selectedDates, ...nextWeekends]
                    .filter((date, index, arr) => 
                      arr.findIndex(d => d.toDateString() === date.toDateString()) === index
                    )
                    .sort((a, b) => a.getTime() - b.getTime());
                  setSelectedDates(combined);
                }}
              >
                Add Next 8 Saturdays
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const monthlyDates = [];
                  for (let i = 1; i <= 6; i++) {
                    const date = new Date(today.getFullYear(), today.getMonth() + i, 15);
                    monthlyDates.push(date);
                  }
                  const combined = [...selectedDates, ...monthlyDates]
                    .filter((date, index, arr) => 
                      arr.findIndex(d => d.toDateString() === date.toDateString()) === index
                    )
                    .sort((a, b) => a.getTime() - b.getTime());
                  setSelectedDates(combined);
                }}
              >
                Add Monthly (15th)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDates([])}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Save Calendar ({selectedDates.length} dates)
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarManager;
