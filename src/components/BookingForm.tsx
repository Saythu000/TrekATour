import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Phone, Mail, User, ExternalLink, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  selectedPackage?: {
    id: number;
    title: string;
    duration: string;
    difficulty: string;
    price: string;
  };
}

const BookingForm = ({ selectedPackage }: BookingFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "",
    preferredDate: "",
    packageType: selectedPackage?.title || "",
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
    dietaryRequirements: "",
    medicalConditions: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Please enter a valid 10-digit phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.groupSize) newErrors.groupSize = "Group size is required";
    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
    if (!formData.packageType) newErrors.packageType = "Package selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Continue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handleStep2Continue = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    } else {
      toast({
        title: "Validation Error", 
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    try {
      // Create WhatsApp message
      const message = `🏔️ *New Booking Request*

*Personal Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

*Trip Details:*
Package: ${formData.packageType}
Group Size: ${formData.groupSize} people
Preferred Date: ${formData.preferredDate}

*Additional Information:*
Emergency Contact: ${formData.emergencyContact || 'Not provided'}
Emergency Phone: ${formData.emergencyPhone || 'Not provided'}
Dietary Requirements: ${formData.dietaryRequirements || 'None'}
Medical Conditions: ${formData.medicalConditions || 'None'}
Special Requests: ${formData.specialRequests || 'None'}

Please confirm this booking and provide further details.`;

      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Booking Request Sent!",
        description: "Your booking request has been sent via WhatsApp. We'll contact you soon!",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        groupSize: "",
        preferredDate: "",
        packageType: "",
        specialRequests: "",
        emergencyContact: "",
        emergencyPhone: "",
        dietaryRequirements: "",
        medicalConditions: "",
      });
      setCurrentStep(1);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const packages = [
    "Himalayan Base Camp Trek",
    "Weekend Goa Adventure", 
    "Kerala Backwaters",
    "Himachal Backpacking Adventure",
    "Spiti Valley Backpacking",
    "Custom Package"
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Enter your phone number"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleStep1Continue} className="flex items-center gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Trip Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageType">Select Package *</Label>
            <Select value={formData.packageType} onValueChange={(value) => setFormData({...formData, packageType: value})}>
              <SelectTrigger className={errors.packageType ? "border-destructive" : ""}>
                <SelectValue placeholder="Choose a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.packageType && <p className="text-sm text-destructive">{errors.packageType}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupSize">Group Size *</Label>
            <Select value={formData.groupSize} onValueChange={(value) => setFormData({...formData, groupSize: value})}>
              <SelectTrigger className={errors.groupSize ? "border-destructive" : ""}>
                <SelectValue placeholder="Number of people" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size} {size === 1 ? 'person' : 'people'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.groupSize && <p className="text-sm text-destructive">{errors.groupSize}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred Date *</Label>
          <Input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
            className={errors.preferredDate ? "border-destructive" : ""}
          />
          {errors.preferredDate && <p className="text-sm text-destructive">{errors.preferredDate}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            placeholder="Any special requirements or requests..."
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={handleStep2Continue} className="flex items-center gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-4 w-4" />
          Booking Confirmation
        </h3>
        
        {/* Booking Summary */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">PERSONAL DETAILS</h4>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">TRIP DETAILS</h4>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Package:</span> {formData.packageType}</p>
              <p><span className="font-medium">Group Size:</span> {formData.groupSize} people</p>
              <p><span className="font-medium">Preferred Date:</span> {formData.preferredDate}</p>
              {formData.specialRequests && (
                <p><span className="font-medium">Special Requests:</span> {formData.specialRequests}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Additional Information (Optional)</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                placeholder="Emergency contact person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                placeholder="Emergency contact number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
            <Input
              id="dietaryRequirements"
              value={formData.dietaryRequirements}
              onChange={(e) => setFormData({...formData, dietaryRequirements: e.target.value})}
              placeholder="Vegetarian, vegan, allergies, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
              placeholder="Any medical conditions we should know about..."
              rows={2}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleConfirmBooking} 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? "Sending..." : "Confirm Booking"} <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Book Your Adventure
        </CardTitle>
        <CardDescription>
          Step {currentStep} of 3: {currentStep === 1 ? "Personal Information" : currentStep === 2 ? "Trip Details" : "Confirmation"}
        </CardDescription>
        {selectedPackage && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{selectedPackage.difficulty}</Badge>
            <span className="font-medium">{selectedPackage.title}</span>
            <span className="text-muted-foreground">({selectedPackage.duration})</span>
          </div>
        )}
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
};

export default BookingForm;
