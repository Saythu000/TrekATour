import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { tripService, bookingService, Trip } from "@/lib/dataService";
import { filterValidDates } from "@/utils/dateUtils";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Shield,
  MapPin,
  CreditCard,
  Heart,
  Share2,
  Camera,
  Mountain,
  Compass,
  Award,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BookingPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customDate, setCustomDate] = useState<string>("");
  const [travelers, setTravelers] = useState(1);
  const [validDates, setValidDates] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    specialRequests: "",
    travelExperience: "beginner",
    accommodation: "shared",
    transportation: "included"
  });

  // Validation state
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    selectedDate: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters";
    if (/\d/.test(name)) return "Full name cannot contain numbers";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) return "Phone number must be exactly 10 digits";
    if (!/^[6-9]/.test(cleanPhone)) return "Phone number must start with 6, 7, 8, or 9";
    return "";
  };

  const validateSelectedDate = (): string => {
    if (!selectedDate) return "Please select a travel date";
    if (selectedDate === "other" && !customDate) return "Please enter a custom date";
    return "";
  };

  // Check overall form validity
  const checkFormValidity = () => {
    const nameError = validateFullName(formData.fullName);
    const phoneError = validatePhone(formData.phone);
    const dateError = validateSelectedDate();
    
    const errors = {
      fullName: nameError,
      phone: phoneError,
      selectedDate: dateError
    };
    
    setFormErrors(errors);
    const isValid = !nameError && !phoneError && !dateError;
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  // Check form validity when form data or selected date changes
  useEffect(() => {
    const timer = setTimeout(() => {
      checkFormValidity();
    }, 100); // Small delay to ensure state updates are complete
    
    return () => clearTimeout(timer);
  }, [formData.fullName, formData.phone, selectedDate, customDate]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const tripData = await tripService.getById(tripId!);
      
      if (tripData) {
        // Check for stored images in localStorage first
        const imageStorageKey = `trip_image_${tripData.slug}`;
        const storedImage = localStorage.getItem(imageStorageKey);
        
        if (storedImage) {
          tripData.image_url = storedImage;
        }
        
        // Load available dates from localStorage
        const storedDates = localStorage.getItem(`trip_dates_${tripData.slug}`);
        if (storedDates) {
          try {
            tripData.available_dates = JSON.parse(storedDates);
          } catch (e) {
            console.error('Error parsing stored dates:', e);
          }
        }
        
        // Load visibility status from localStorage
        const storedActive = localStorage.getItem(`trip_active_${tripData.slug}`);
        if (storedActive) {
          try {
            tripData.is_active = JSON.parse(storedActive);
          } catch (e) {
            console.error('Error parsing stored active status:', e);
          }
        } else {
          tripData.is_active = true; // Default to active
        }
        
        // Check for stored edits in localStorage (same as TripDetails page)
        const editsKey = `trip_edits_${tripId}`;
        const storedEdits = localStorage.getItem(editsKey);
        
        if (storedEdits) {
          try {
            const parsedEdits = JSON.parse(storedEdits);
            Object.assign(tripData, parsedEdits);
          } catch (e) {
            console.error('Error parsing stored edits:', e);
          }
        }
        
        setTrip(tripData);
        
        // Filter valid dates (non-expired) for booking
        const filteredDates = filterValidDates(tripData.available_dates || []);
        setValidDates(filteredDates);
        
        console.log(`📅 Booking page: ${tripData.available_dates?.length || 0} total dates, ${filteredDates.length} valid dates`);
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      toast({
        title: "Error",
        description: "Failed to load trip details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    // Special handling for phone number - only allow digits and limit to 10
    if (field === 'phone') {
      const cleanValue = value.toString().replace(/\D/g, ''); // Remove non-digits
      if (cleanValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: cleanValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!checkFormValidity()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBooking(true);
    
    try {
      // Show processing for a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare WhatsApp message with all booking details
      const message = `🏔️ *New Booking Request*

📍 *Trip:* ${trip.title}
💰 *Price:* ₹${trip.base_price.toLocaleString()} per person
👥 *Travelers:* ${travelers}
📅 *Selected Date:* ${selectedDate === "other" ? customDate : selectedDate}

👤 *Customer Details:*
• Name: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}

📝 *Special Requests:*
${formData.specialRequests || 'None'}

💵 *Total Amount:* ₹${(trip.base_price * travelers).toLocaleString()}

Please confirm this booking. Thank you!`;

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919966996863?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Redirecting to WhatsApp",
        description: "Please confirm your booking via WhatsApp message.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center max-w-md mx-auto p-8">
          <Mountain className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Adventure Not Found</h1>
          <p className="text-gray-600 mb-6">The adventure you're looking for seems to have wandered off the trail.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Adventures
          </Button>
        </div>
      </div>
    );
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${trip.image_url || '/placeholder-trip.jpg'})` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={() => navigate(-1)}
            className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Trip Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-orange-600 text-white px-3 py-1">
                {trip.category || 'Adventure'}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{trip.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        currentStep >= step 
                          ? 'bg-orange-600 text-white shadow-lg' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                      </div>
                      {step < 2 && (
                        <div className={`h-1 w-32 mx-4 transition-all duration-300 ${
                          currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-32 text-sm text-gray-600">
                  <span>Booking Details</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {/* Form Steps */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Compass className="w-6 h-6" />
                    Book Your Adventure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleBooking}>
                    <AnimatePresence mode="wait">
                      {/* Step 1: Booking Details */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h3>
                          
                          {/* Personal Information */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="date" className="text-sm font-medium text-gray-700">Select Date *</Label>
                              {/* Check if admin has set any dates */}
                              {trip.available_dates && trip.available_dates.length > 0 ? (
                                /* Admin has set dates - show valid dates + Other option */
                                validDates && validDates.length > 0 ? (
                                  <>
                                    <select
                                      id="date"
                                      value={selectedDate}
                                      onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        if (e.target.value !== "other") {
                                          setCustomDate("");
                                        }
                                      }}
                                      className={`mt-2 w-full h-12 px-3 border rounded-md focus:ring-orange-500 bg-white ${
                                        formErrors.selectedDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                      }`}
                                      required
                                    >
                                      <option value="">Select a date</option>
                                      {validDates.map((date, index) => (
                                        <option key={index} value={date}>
                                          {date}
                                        </option>
                                      ))}
                                      <option value="other">Other (Contact for custom date)</option>
                                    </select>
                                    
                                    {selectedDate === "other" && (
                                      <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                        <p className="text-sm text-orange-800 mb-2">
                                          For custom dates, please contact us directly. We'll help you find the perfect date for your adventure!
                                        </p>
                                        <Input
                                          type="date"
                                          value={customDate}
                                          onChange={(e) => setCustomDate(e.target.value)}
                                          className="h-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                                          placeholder="Preferred date"
                                          min={new Date().toISOString().split('T')[0]}
                                        />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  /* Admin set dates but all expired - show Other option only */
                                  <>
                                    <select
                                      id="date"
                                      value={selectedDate}
                                      onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        if (e.target.value !== "other") {
                                          setCustomDate("");
                                        }
                                      }}
                                      className={`mt-2 w-full h-12 px-3 border rounded-md focus:ring-orange-500 bg-white ${
                                        formErrors.selectedDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                      }`}
                                      required
                                    >
                                      <option value="">Select a date</option>
                                      <option value="other">Request Custom Date (All scheduled dates have passed)</option>
                                    </select>
                                    
                                    {selectedDate === "other" && (
                                      <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                        <p className="text-sm text-orange-800 mb-2">
                                          All scheduled dates have passed. Please select your preferred date and we'll arrange the trip for you!
                                        </p>
                                        <Input
                                          type="date"
                                          value={customDate}
                                          onChange={(e) => setCustomDate(e.target.value)}
                                          className="h-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                                          placeholder="Preferred date"
                                          min={new Date().toISOString().split('T')[0]}
                                        />
                                      </div>
                                    )}
                                  </>
                                )
                              ) : (
                                /* Admin hasn't set any dates - show Other option only */
                                <>
                                  <select
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                      setSelectedDate(e.target.value);
                                      if (e.target.value !== "other") {
                                        setCustomDate("");
                                      }
                                    }}
                                    className={`mt-2 w-full h-12 px-3 border rounded-md focus:ring-orange-500 bg-white ${
                                      formErrors.selectedDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                    }`}
                                    required
                                  >
                                    <option value="">Select a date</option>
                                    <option value="other">Request Custom Date</option>
                                  </select>
                                  
                                  {selectedDate === "other" && (
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                      <p className="text-sm text-blue-800 mb-2">
                                        This trip is available on request. Please select your preferred date and we'll arrange everything for you!
                                      </p>
                                      <Input
                                        type="date"
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="h-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Preferred date"
                                        min={new Date().toISOString().split('T')[0]}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {formErrors.selectedDate && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.selectedDate}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                              <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className={`mt-2 h-12 focus:ring-orange-500 ${
                                  formErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                }`}
                                placeholder="Enter your full name"
                                required
                              />
                              {formErrors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                              <div className="relative">
                                <Input
                                  id="phone"
                                  type="tel"
                                  inputMode="numeric"
                                  value={formData.phone ? `+91 ${formData.phone}` : ''}
                                  onChange={(e) => {
                                    const value = e.target.value.replace('+91 ', '');
                                    handleInputChange('phone', value);
                                  }}
                                  className={`mt-2 h-12 focus:ring-orange-500 ${
                                    formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                  }`}
                                  placeholder="+91 9876543210"
                                  maxLength={14}
                                  required
                                />
                              </div>
                              {formErrors.phone && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="your@email.com"
                                required
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Number of Travelers</Label>
                              <div className="mt-2 flex items-center gap-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                  className="w-10 h-10"
                                >
                                  -
                                </Button>
                                <span className="text-lg font-semibold w-8 text-center">{travelers}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTravelers(Math.min(trip.max_people || 15, travelers + 1))}
                                  className="w-10 h-10"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="requests" className="text-sm font-medium text-gray-700">Special Requests</Label>
                            <Textarea
                              id="requests"
                              value={formData.specialRequests}
                              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                              className="mt-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                              placeholder="Any dietary restrictions, medical conditions, or special requirements..."
                              rows={4}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Confirmation */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">Review & Confirm</h3>
                          
                          <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span>Trip:</span>
                                <span className="font-medium">{trip.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Name:</span>
                                <span className="font-medium">{formData.fullName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="font-medium">{formData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Phone:</span>
                                <span className="font-medium">+91 {formData.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Travelers:</span>
                                <span className="font-medium">{travelers} person{travelers > 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date:</span>
                                <span className="font-medium">{selectedDate === "other" ? customDate || 'Custom date to be confirmed' : selectedDate || 'To be confirmed'}</span>
                              </div>
                              {formData.specialRequests && (
                                <div className="pt-2 border-t">
                                  <span className="font-medium">Special Requests:</span>
                                  <p className="mt-1 text-gray-600">{formData.specialRequests}</p>
                                </div>
                              )}
                              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-orange-600">₹{((trip.base_price || 0) * travelers).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">Secure Booking</p>
                              <p>Your payment is protected and your booking is confirmed instantly.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="px-8 py-3"
                      >
                        Previous
                      </Button>
                      
                      {currentStep < 2 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isBooking || !isFormValid}
                          className={`px-8 py-3 shadow-lg ${
                            isFormValid 
                              ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white' 
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {isBooking ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              Preparing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Confirm Booking
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-6 space-y-6"
            >
              {/* Price Card */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold">₹{trip.base_price?.toLocaleString()}</div>
                    <div className="text-orange-100">per person</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Best price guarantee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Award className="w-12 h-12 text-blue-600 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Trusted by 10,000+ Travelers</h3>
                      <p className="text-sm text-gray-600 mt-2">Join thousands of happy adventurers who chose us for their perfect trip.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
