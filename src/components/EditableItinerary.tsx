import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { ItineraryDay } from "@/lib/tripSections";
import { Edit3, Check, X, Plus, Minus } from "lucide-react";

interface EditableItineraryProps {
  itinerary: ItineraryDay[];
  onSave: (itinerary: ItineraryDay[]) => void;
}

const EditableItinerary = ({ itinerary, onSave }: EditableItineraryProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editItinerary, setEditItinerary] = useState<ItineraryDay[]>(itinerary);

  const handleSave = () => {
    onSave(editItinerary);
    setIsEditing(false);
    toast({
      title: "Itinerary updated",
      description: "The itinerary has been successfully updated."
    });
  };

  const handleCancel = () => {
    setEditItinerary(itinerary);
    setIsEditing(false);
  };

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: `Day ${editItinerary.length + 1}`,
      title: "New Activity",
      description: "Description of the day's activities"
    };
    setEditItinerary([...editItinerary, newDay]);
  };

  const removeDay = (index: number) => {
    const newItinerary = editItinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = newItinerary.map((day, i) => ({
      ...day,
      day: `Day ${i + 1}`
    }));
    setEditItinerary(renumbered);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | string[]) => {
    const newItinerary = [...editItinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setEditItinerary(newItinerary);
  };

  if (!isAdmin && !isEditing) {
    return (
      <div className="space-y-6">
        {itinerary.map((day, index) => (
          <div key={index} className="border-l-2 border-primary pl-6 relative">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
            <div>
              <h4 className="font-semibold text-lg">{day.day}: {day.title}</h4>
              <p className="text-muted-foreground mt-2">{day.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Detailed Itinerary</h3>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-xs"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit Itinerary
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {editItinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  value={day.day}
                  onChange={(e) => updateDay(dayIndex, 'day', e.target.value)}
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDay(dayIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              <Input
                value={day.title}
                onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                placeholder="Day title"
              />

              <Textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                placeholder="Day description"
                rows={3}
              />
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addDay}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Itinerary
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <div key={index} className="border-l-2 border-primary pl-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div>
                <h4 className="font-semibold text-lg">{day.day}: {day.title}</h4>
                <p className="text-muted-foreground mt-2">{day.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableItinerary;
