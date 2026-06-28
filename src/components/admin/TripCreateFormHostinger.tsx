import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { tripService, Trip } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { convertToPoints } from "@/lib/textUtils";

interface TripCreateFormProps {
  onClose: () => void;
  onTripCreated: () => void;
  editTrip?: Trip | null; // Add edit trip prop
}

const TripCreateFormHostinger = ({ onClose, onTripCreated, editTrip }: TripCreateFormProps) => {
  const isEditMode = !!editTrip;
  
  const [formData, setFormData] = useState({
    title: editTrip?.title || "",
    category: editTrip?.category || "",
    base_price: editTrip?.base_price?.toString() || "",
    original_price: editTrip?.original_price?.toString() || "",
    duration: editTrip?.duration || "",
    short_desc: editTrip?.short_desc || "",
    difficulty: editTrip?.difficulty || ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>(editTrip?.available_dates || []);
  const [isActive, setIsActive] = useState<boolean>(editTrip?.is_active ?? true);
  const [newDate, setNewDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { toast } = useToast();

  // Load existing image for edit mode
  useEffect(() => {
    if (isEditMode && editTrip) {
      const localImage = localStorage.getItem(`trip_image_${editTrip.slug}`);
      const existingImage = localImage || editTrip.image_url;
      if (existingImage) {
        setImagePreview(existingImage);
      }
    }
  }, [isEditMode, editTrip]);

  const categories = [
    "Himachal Trips",
    "Weekend Getaway",
    "Backpacking Trips", 
    "International Gateways",
    "Trekking & Hiking",
    "Adventure Activities",
    "Road Trips & Touring",
    "Camping Escapes"
  ];

  const difficulties = ["Easy", "Moderate", "Challenging", "Expert"];

  // Date management functions
  const addDate = () => {
    if (!newDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (availableDates.includes(formattedDate)) {
      toast({
        title: "Error",
        description: "This date is already added",
        variant: "destructive",
      });
      return;
    }

    setAvailableDates(prev => [...prev, formattedDate].sort());
    setNewDate("");
  };

  const removeDate = (dateToRemove: string) => {
    setAvailableDates(prev => prev.filter(date => date !== dateToRemove));
  };

  // Get remaining Fridays in current month
  const addAllFridays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const fridays = [];
    for (let day = today.getDate(); day <= lastDay; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5) { // Friday = 5
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
        if (!availableDates.includes(formattedDate)) {
          fridays.push(formattedDate);
        }
      }
    }
    
    if (fridays.length > 0) {
      setAvailableDates(prev => [...prev, ...fridays].sort());
      toast({ title: "Success", description: `Added ${fridays.length} Friday dates` });
    } else {
      toast({ title: "Info", description: "No new Fridays available this month" });
    }
  };

  // Get remaining Saturdays in current month  
  const addAllSaturdays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const saturdays = [];
    for (let day = today.getDate(); day <= lastDay; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 6) { // Saturday = 6
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
        if (!availableDates.includes(formattedDate)) {
          saturdays.push(formattedDate);
        }
      }
    }
    
    if (saturdays.length > 0) {
      setAvailableDates(prev => [...prev, ...saturdays].sort());
      toast({ title: "Success", description: `Added ${saturdays.length} Saturday dates` });
    } else {
      toast({ title: "Info", description: "No new Saturdays available this month" });
    }
  };

  // Image processing function
  const resizeImage = (file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // Resize and compress image
      const resizedFile = await resizeImage(file);
      
      setSelectedImage(resizedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);
      
      toast({
        title: "Success",
        description: "Image processed and ready for upload",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Create a fake event to reuse handleImageSelect
        const fakeEvent = {
          target: { files: [file] }
        } as React.ChangeEvent<HTMLInputElement>;
        handleImageSelect(fakeEvent);
      }
    }
  };

  // Upload image - using PHP API endpoint
  const uploadImage = async (file: File, tripId: string): Promise<string | null> => {
    try {
      console.log('Uploading image to server for trip:', tripId);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api-php/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('✅ Image uploaded successfully:', result.url);
      return result.url;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.base_price || !formData.duration || !formData.short_desc) {
      toast({
        title: "Error",
        description: "Title, category, price, duration, and description are required",
        variant: "destructive",
      });
      return;
    }

    // Validate pricing logic
    const basePrice = parseFloat(formData.base_price);
    const originalPrice = formData.original_price ? parseFloat(formData.original_price) : null;
    
    if (originalPrice && originalPrice <= basePrice) {
      toast({
        title: "Error",
        description: "Original price must be higher than current price",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      let imageUrl = null;

      // Handle image upload if new image selected
      if (selectedImage) {
        toast({
          title: "Uploading",
          description: "Processing image...",
        });
        
        try {
          imageUrl = await uploadImage(selectedImage, slug);
          
          if (!imageUrl) {
            console.warn("Image upload failed, proceeding without new image");
            toast({
              title: "Warning",
              description: "Image upload failed, but trip will be saved without new image",
            });
          }
        } catch (error) {
          console.error("Image upload error:", error);
          toast({
            title: "Warning", 
            description: "Image upload failed, proceeding without new image",
          });
        }
      }

      const tripData: any = {
        title: formData.title,
        slug: slug || `trip-${Date.now()}`,
        category: formData.category,
        base_price: parseFloat(formData.base_price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        duration: formData.duration,
        short_desc: (() => {
          const converted = convertToPoints(formData.short_desc);
          console.log('Original text:', formData.short_desc);
          console.log('Converted text:', converted);
          return converted;
        })(),
        difficulty: formData.difficulty || 'Moderate',
        available_dates: availableDates,
        is_active: isActive
      };

      // Debug: Log the trip data being sent
      console.log('🔍 Trip data being sent to database:', tripData);
      console.log('🔍 Original price value:', formData.original_price, '→', tripData.original_price);

      // Only add image_url if we have a new one, or keep existing for edit mode
      if (imageUrl) {
        tripData.image_url = imageUrl;
      } else if (isEditMode && !selectedImage && editTrip?.image_url) {
        // Keep existing image if no new image uploaded in edit mode
        tripData.image_url = editTrip.image_url;
      }

      let result;
      if (isEditMode && editTrip) {
        // Update existing trip
        result = await tripService.update(editTrip.id, tripData);
      } else {
        // Create new trip
        result = await tripService.create(tripData);
      }
      
      if (result) {
        toast({
          title: "Success",
          description: `Trip ${isEditMode ? 'updated' : 'created'} successfully${imageUrl ? ' with image' : ''}!`,
        });
        
        // Clear form
        setFormData({
          title: "",
          category: "",
          base_price: "",
          original_price: "",
          duration: "",
          short_desc: "",
          difficulty: ""
        });
        setSelectedImage(null);
        setImagePreview(null);
        setAvailableDates([]);
        setIsActive(true);
        setNewDate("");
        
        onTripCreated();
      } else {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} trip`);
      }
    } catch (error) {
      console.error(`Trip ${isEditMode ? 'update' : 'creation'} error:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} trip: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle>{isEditMode ? 'Edit Trip' : 'Create New Trip'} (Hostinger)</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter trip title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="base_price">Current Price (₹) *</Label>
              <Input
                id="base_price"
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="Enter current price"
                required
              />
            </div>

            <div>
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                placeholder="Enter original price (optional)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty if no discount. Must be higher than current price.
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 Days 2 Nights"
                required
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="short_desc">Short Description *</Label>
            <Textarea
              id="short_desc"
              value={formData.short_desc}
              onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
              placeholder="Brief description of the trip"
              rows={3}
              required
            />
          </div>

          {/* Available Dates Section */}
          <div>
            <Label>Available Dates</Label>
            <div className="flex gap-2 mb-3">
              <Button type="button" onClick={addAllFridays} variant="outline" size="sm">
                All Fridays
              </Button>
              <Button type="button" onClick={addAllSaturdays} variant="outline" size="sm">
                All Saturdays  
              </Button>
            </div>
            <div className="space-y-3">
              {/* Add New Date */}
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1"
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
                <Button
                  type="button"
                  onClick={addDate}
                  variant="outline"
                  size="sm"
                >
                  Add Date
                </Button>
              </div>
              
              {/* Display Added Dates */}
              {availableDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Added Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{date}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-orange-200"
                          onClick={() => removeDate(date)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Package Visibility Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base font-medium">Package Visibility</Label>
              <p className="text-sm text-gray-600">
                {isActive ? "Package is visible to customers" : "Package is hidden from customers"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">OFF</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500">ON</span>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <Label htmlFor="image">Trip Image</Label>
            <div className="mt-2 space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Trip preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {isEditMode && !selectedImage && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Current Image
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploadingImage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || isUploadingImage} className="flex-1">
              {isSubmitting ? (
                selectedImage ? `${isEditMode ? 'Updating' : 'Creating'} Trip & Processing Image...` : `${isEditMode ? 'Updating' : 'Creating'} Trip...`
              ) : (
                isEditMode ? "Update Trip" : "Create Trip"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripCreateFormHostinger;
