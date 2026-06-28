import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { bookingFormSchema, BookingFormData } from "@/lib/validationSchemas";
import { AdminTrip } from "@/lib/adminStorage";
import { Calendar, Users, Phone, Mail, MapPin, AlertCircle } from "lucide-react";

interface BookingFormProps {
  trip: AdminTrip;
  selectedDate?: Date;
}

const BookingFormValidated = ({ trip, selectedDate }: BookingFormProps) => {
  const { toast } = useToast();
  const { validate, validateField, errors, clearFieldError } = useFormValidation(bookingFormSchema);
  
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    traveller_mode: undefined,
    stay_type: "Quad Sharing",
    adults: 1,
    email: "",
    phone: "",
    specialRequests: ""
  });

  const stayTypes = [
    { value: "Quad Sharing", price: 0 },
    { value: "Triple Sharing", price: 500 },
    { value: "Twin Sharing", price: 1000 },
    { value: "Single Sharing", price: 2000 }
  ];

  const travelModes = ["Solo", "Couple", "Family", "Group"];

  const getStayTypePrice = (stayType: string) => {
    return stayTypes.find(s => s.value === stayType)?.price || 0;
  };

  const calculateTotal = () => {
    const basePrice = trip.basePrice;
    const stayUpcharge = getStayTypePrice(formData.stay_type || "Quad Sharing");
    const totalPerPerson = basePrice + stayUpcharge;
    return totalPerPerson * (formData.adults || 1);
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleFieldBlur = (field: keyof BookingFormData, value: unknown) => {
    validateField(field, value);
  };

  const handleBookNow = () => {
    const validationResult = validate(formData);
    
    if (!validationResult.isValid) {
      return;
    }

    const validatedData = validationResult.data!;
    const total = calculateTotal();
    
    const message = `Hi! I want to book *${trip.title}*\n\n` +
      `📅 Date: ${selectedDate ? selectedDate.toLocaleDateString() : 'To be decided'}\n` +
      `👥 Adults: ${validatedData.adults}\n` +
      `🏠 Stay: ${validatedData.stay_type}\n` +
      `🧳 Travel Mode: ${validatedData.traveller_mode}\n` +
      `💰 Total: ₹${total.toLocaleString()}\n\n` +
      `📧 Email: ${validatedData.email}\n` +
      `📱 Phone: ${validatedData.phone}` +
      (validatedData.specialRequests ? `\n\n📝 Special Requests: ${validatedData.specialRequests}` : '') +
      `\n\nPlease confirm my booking!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919966996863?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you shortly to confirm your booking.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book Your Adventure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Travel Mode */}
        <div className="space-y-2">
          <Label htmlFor="traveller_mode">Travel Mode *</Label>
          <Select
            value={formData.traveller_mode || ""}
            onValueChange={(value) => handleInputChange("traveller_mode", value)}
          >
            <SelectTrigger className={errors.traveller_mode ? "border-red-500" : ""}>
              <SelectValue placeholder="Select travel mode" />
            </SelectTrigger>
            <SelectContent>
              {travelModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.traveller_mode && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.traveller_mode}
            </p>
          )}
        </div>

        {/* Stay Type */}
        <div className="space-y-2">
          <Label htmlFor="stay_type">Accommodation Type</Label>
          <Select
            value={formData.stay_type}
            onValueChange={(value) => handleInputChange("stay_type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stayTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.value} {type.price > 0 && `(+₹${type.price})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Adults */}
        <div className="space-y-2">
          <Label htmlFor="adults">Number of Adults *</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={formData.adults}
            onChange={(e) => handleInputChange("adults", parseInt(e.target.value) || 1)}
            onBlur={(e) => handleFieldBlur("adults", parseInt(e.target.value))}
            className={errors.adults ? "border-red-500" : ""}
          />
          {errors.adults && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.adults}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={(e) => handleFieldBlur("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            onBlur={(e) => handleFieldBlur("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
          <Textarea
            placeholder="Any dietary requirements, medical conditions, or special requests..."
            value={formData.specialRequests}
            onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            onBlur={(e) => handleFieldBlur("specialRequests", e.target.value)}
            className={errors.specialRequests ? "border-red-500" : ""}
            rows={3}
          />
          {errors.specialRequests && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.specialRequests}
            </p>
          )}
        </div>

        {/* Total Price */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">
              ₹{calculateTotal().toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Base price: ₹{trip.basePrice.toLocaleString()} × {formData.adults} adults
            {getStayTypePrice(formData.stay_type || "Quad Sharing") > 0 && 
              ` + ₹${getStayTypePrice(formData.stay_type || "Quad Sharing")} accommodation upgrade`
            }
          </p>
        </div>

        {/* Book Now Button */}
        <Button 
          onClick={handleBookNow}
          className="w-full"
          size="lg"
        >
          Book Now via WhatsApp
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          * Required fields. Your booking request will be sent via WhatsApp for confirmation.
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingFormValidated;
