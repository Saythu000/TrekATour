import { useState, useEffect } from "react";
import { Star, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { getTripRating, saveTripRating, TripRating } from "@/lib/reviewStorage";

interface EditableRatingProps {
  tripId: string;
}

const EditableRating = ({ tripId }: EditableRatingProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [rating, setRating] = useState<TripRating>({ tripId, rating: 4.8, reviewCount: 124 });
  const [isEditing, setIsEditing] = useState(false);
  const [tempRating, setTempRating] = useState(rating);

  useEffect(() => {
    const tripRating = getTripRating(tripId);
    setRating(tripRating);
    setTempRating(tripRating);
  }, [tripId]);

  const handleSave = () => {
    saveTripRating(tempRating);
    setRating(tempRating);
    setIsEditing(false);
    toast({
      title: "Rating Updated",
      description: "Trip rating has been updated successfully."
    });
  };

  const handleCancel = () => {
    setTempRating(rating);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempRating(rating);
    setIsEditing(true);
  };

  return (
    <div className="flex items-center gap-2">
      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={tempRating.rating}
            onChange={(e) => setTempRating(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
            className="w-16 h-8 text-sm"
          />
          <span className="text-sm">(</span>
          <Input
            type="number"
            min="0"
            value={tempRating.reviewCount}
            onChange={(e) => setTempRating(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
            className="w-20 h-8 text-sm"
          />
          <span className="text-sm">reviews)</span>
          
          <div className="flex gap-1 ml-2">
            <Button size="sm" onClick={handleSave} className="h-8 px-2">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-2">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">
            {rating.rating} ({rating.reviewCount} reviews)
          </span>
          {isAdmin && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableRating;
