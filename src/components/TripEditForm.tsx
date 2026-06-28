import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { ButtonLoading } from "@/components/ui/loading";
import { AdminTrip } from "@/lib/adminStorage";
import { X } from "lucide-react";

interface TripEditFormProps {
  trip: AdminTrip;
  onSave: (updatedTrip: AdminTrip) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TripEditForm = ({ trip, onSave, onCancel, isLoading = false }: TripEditFormProps) => {
  const [formData, setFormData] = useState({
    title: trip.title,
    category: trip.category,
    region: trip.region,
    difficulty: trip.difficulty,
    basePrice: trip.basePrice,
    duration: trip.duration,
    shortDesc: trip.shortDesc,
    image: trip.image || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrip: AdminTrip = {
      ...trip,
      ...formData,
      updated_at: new Date().toISOString(),
    };
    onSave(updatedTrip);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Trip: {trip.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <Input
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <Input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleChange('basePrice', Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="e.g., 3 Days, 2 Nights"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Trip Image</label>
              <ImageUpload
                value={formData.image}
                onChange={(value) => handleChange('image', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.shortDesc}
                onChange={(e) => handleChange('shortDesc', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? <ButtonLoading text="Saving..." /> : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripEditForm;
