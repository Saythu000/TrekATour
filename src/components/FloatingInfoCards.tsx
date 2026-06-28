import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, TrendingUp, Edit3, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingFormAdvanced from "@/components/BookingFormAdvanced";
import DropdownCalendar from "@/components/DropdownCalendar";
import { AdminTrip, getTripAvailableDates } from "@/lib/adminStorage";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { siteConfigService } from "@/lib/databaseService";

interface FloatingInfoCardsProps {
  trip: AdminTrip;
}

interface GroupSizeData {
  tripId: string;
  groupSize: string;
}

const FloatingInfoCards = ({ trip }: FloatingInfoCardsProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [groupSize, setGroupSize] = useState("8-15");
  const [isEditing, setIsEditing] = useState(false);
  const [tempGroupSize, setTempGroupSize] = useState(groupSize);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    loadGroupSize();
    loadAvailableDates();
  }, [trip.id]);

  const loadAvailableDates = () => {
    const dates = getTripAvailableDates(trip.id);
    setAvailableDates(dates);
  };

  const loadGroupSize = async () => {
    try {
      const groupSizes = await siteConfigService.get('group_sizes') || [];
      const tripGroupSize = groupSizes.find((g: any) => g.tripId === trip.id);
      if (tripGroupSize) {
        setGroupSize(tripGroupSize.groupSize);
        setTempGroupSize(tripGroupSize.groupSize);
      }
    } catch (error) {
      console.error('Failed to load group size:', error);
    }
  };

  const saveGroupSize = async () => {
    try {
      const groupSizes = await siteConfigService.get('group_sizes') || [];
      const index = groupSizes.findIndex((g: any) => g.tripId === trip.id);
      
      if (index !== -1) {
        groupSizes[index].groupSize = tempGroupSize;
      } else {
        groupSizes.push({ tripId: trip.id, groupSize: tempGroupSize });
      }
      
      const success = await siteConfigService.set('group_sizes', groupSizes);
      if (success) {
        setGroupSize(tempGroupSize);
        setIsEditing(false);
        
        toast({
          title: "Group Size Updated",
          description: "Group size has been updated successfully."
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update group size",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempGroupSize(groupSize);
    setIsEditing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4 z-10">
      {/* Price Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-white/90">Starting from</span>
        </div>
        <div className="text-3xl font-bold text-white">
          ₹{trip.basePrice.toLocaleString()}
        </div>
        <div className="text-sm text-white/80 mb-4">per person</div>
        
        {/* Book Now Button */}
        <Button
          onClick={() => setIsBookingOpen(true)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Book Now
        </Button>
      </motion.div>

      {/* Trip Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 flex-1 min-w-[300px]"
      >
        <h1 className="text-2xl font-bold text-white mb-4">{trip.title}</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/90">{trip.region}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-white/90">{trip.duration}</span>
          </div>
          
          <div className="flex items-center gap-2 col-span-2">
            <Users className="h-4 w-4 text-orange-400" />
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  value={tempGroupSize}
                  onChange={(e) => setTempGroupSize(e.target.value)}
                  className="h-6 text-xs w-16 px-1 bg-white/20 border-white/30 text-white placeholder-white/60"
                  placeholder="8-15"
                />
                <Button size="sm" onClick={saveGroupSize} className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30">
                  <Save className="h-3 w-3 text-white" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0 border-white/30 hover:bg-white/20">
                  <X className="h-3 w-3 text-white" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm text-white/90">Group Size: {groupSize}</span>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/20"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Badge className={`${getDifficultyColor(trip.difficulty)} text-white`}>
            {trip.difficulty}
          </Badge>
          <Badge variant="secondary">{trip.category}</Badge>
        </div>
      </motion.div>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Your Adventure</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Your Date</h3>
              <DropdownCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            {/* Booking Form */}
            <BookingFormAdvanced trip={trip} selectedDate={selectedDate} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FloatingInfoCards;
