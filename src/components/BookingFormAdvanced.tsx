import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AdminTrip } from "@/lib/adminStorage";
import { Calendar, Users, Phone, Mail, MapPin } from "lucide-react";

interface BookingFormProps {
  trip: AdminTrip;
  selectedDate?: Date;
}

const BookingFormAdvanced = ({ trip, selectedDate }: BookingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    traveller_mode: "",
    stay_type: "Quad Sharing",
    adults: 1,
    email: "",
    phone: ""
  });

  const stayTypes = [
    { value: "Quad Sharing", price: 0 },
    { value: "Triple Sharing", price: 500 },
    { value: "Twin Sharing", price: 1000 },
    { value: "Single Sharing", price: 2000 }
  ];

  const getStayTypePrice = (stayType: string) => {
    return stayTypes.find(s => s.value === stayType)?.price || 0;
  };

  const calculateTotal = () => {
    const basePrice = trip.basePrice;
    const stayUpcharge = getStayTypePrice(formData.stay_type);
    const totalPerPerson = basePrice + stayUpcharge;
    return totalPerPerson * formData.adults;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookNow = () => {
    // Validation
    if (!formData.traveller_mode || !formData.email || !formData.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date not selected",
        description: "Please select a trip date first.",
        variant: "destructive"
      });
      return;
    }

    // Create WhatsApp message
    const total = calculateTotal();
    const message = `*TRIP BOOKING REQUEST*

📦 *Package:* ${trip.title}
📅 *Date:* ${selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
🏠 *Stay Type:* ${formData.stay_type}
👥 *Adults:* ${formData.adults}
🚗 *Departure City:* ${formData.traveller_mode}
📧 *Email:* ${formData.email}
📱 *Phone:* ${formData.phone}

💰 *Total Amount:* ₹${total.toLocaleString()}
💳 *Base Price:* ₹${trip.basePrice.toLocaleString()} per person
🏨 *Stay Upcharge:* ₹${getStayTypePrice(formData.stay_type).toLocaleString()} per person

⚠️ *Note:* Deposit will be accepted only up to 7 days before the trip.

Please confirm my booking!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919966996863?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Booking request sent!",
      description: "We'll contact you shortly to confirm your booking."
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Book Your Trip
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>Reserve your spot for the upcoming trip.</p>
          {selectedDate && (
            <p className="mt-1">
              <strong>Event Date:</strong> {selectedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          )}
          <p className="text-amber-600 mt-2">
            ⚠️ Deposit will be accepted only up to 7 days before the trip.
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="traveller_mode">Traveller Mode (Departure City) *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="traveller_mode"
              value={formData.traveller_mode}
              onChange={(e) => handleInputChange('traveller_mode', e.target.value)}
              placeholder="Ex: Hyderabad"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="stay_type">Stay Type *</Label>
          <Select value={formData.stay_type} onValueChange={(value) => handleInputChange('stay_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stayTypes.map((stay) => (
                <SelectItem key={stay.value} value={stay.value}>
                  {stay.value} {stay.price > 0 && `(+₹${stay.price.toLocaleString()})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="adults">Number of Adults *</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="adults"
              type="number"
              min="1"
              max="10"
              value={formData.adults}
              onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Contact Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 9xxxxxxxxx"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Price (per person)</span>
            <span>₹{trip.basePrice.toLocaleString()}</span>
          </div>
          {getStayTypePrice(formData.stay_type) > 0 && (
            <div className="flex justify-between text-sm">
              <span>Stay Upcharge (per person)</span>
              <span>+₹{getStayTypePrice(formData.stay_type).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Adults × {formData.adults}</span>
            <span>₹{((trip.basePrice + getStayTypePrice(formData.stay_type)) * formData.adults).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Amount</span>
            <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <Button 
          onClick={handleBookNow} 
          className="w-full" 
          size="lg"
          disabled={!selectedDate}
        >
          {!selectedDate ? "Select Date First" : "Book Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingFormAdvanced;
