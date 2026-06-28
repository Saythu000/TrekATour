import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Edit3, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { siteContentService } from "@/lib/databaseService";

interface ContactData {
  heroTitle: string;
  heroDescription: string;
  contactInfo: Array<{
    title: string;
    details: string[];
    description: string;
  }>;
  businessHours: Array<{
    day: string;
    hours: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const Contact = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    destination: "",
    planningDates: "",
    travelType: "",
    numberOfTravelers: ""
  });

  const [contactData, setContactData] = useState<ContactData>({
    heroTitle: "Get In Touch",
    heroDescription: "Have questions about our adventures? We're here to help you plan your perfect journey.",
    contactInfo: [
      {
        title: "Call Us",
        details: ["9642211244"],
        description: "We'll respond to your call"
      },
      {
        title: "Email Us", 
        details: ["trekatour@gmail.com"],
        description: "We'll respond within 24 hours"
      },
      {
        title: "Visit Us",
        details: ["Plot No 18, AK Enclave, Shanithi Vihar", "Sainik Puri, Hyd. 500091"],
        description: "Mon-Sat: 10:00 AM - 7:00 PM"
      },
      {
        title: "WhatsApp",
        details: ["9642211244"],
        description: "Quick responses for urgent queries"
      }
    ],
    businessHours: [
      { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "11:00 AM - 5:00 PM" }
    ],
    faqs: [
      {
        question: "How far in advance should I book?",
        answer: "We recommend booking 2-4 weeks in advance for domestic trips and 6-8 weeks for international adventures."
      },
      {
        question: "What's included in trip prices?",
        answer: "Trip prices typically include accommodation, meals, activities, and guide services. Check individual trip details for specifics."
      },
      {
        question: "Do you offer group discounts?",
        answer: "Yes! Groups of 6+ people qualify for special discounts. Contact us for custom group pricing."
      }
    ]
  });

  const [tempData, setTempData] = useState(contactData);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const data = await siteContentService.get('contact', 'content');
      if (data) {
        let parsedData = data;
        
        // If it's a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (error) {
            console.warn('Failed to parse Contact page JSON string:', error);
            return;
          }
        }
        
        if (parsedData && typeof parsedData === 'object') {
          // Merge with defaults to ensure all fields exist
          const mergedData = {
            heroTitle: parsedData.heroTitle || contactData.heroTitle,
            heroDescription: parsedData.heroDescription || contactData.heroDescription,
            contactInfo: Array.isArray(parsedData.contactInfo) && parsedData.contactInfo.length > 0 ? parsedData.contactInfo : contactData.contactInfo,
            businessHours: Array.isArray(parsedData.businessHours) && parsedData.businessHours.length > 0 ? parsedData.businessHours : contactData.businessHours,
            faqs: Array.isArray(parsedData.faqs) && parsedData.faqs.length > 0 ? parsedData.faqs : contactData.faqs
          };
          setContactData(mergedData);
          setTempData(mergedData);
        }
      }
      // If no data or invalid data, keep the default values
    } catch (error) {
      console.error('Failed to load contact data:', error);
      // Keep default data on error
    }
  };

  const saveContactData = async () => {
    try {
      const success = await siteContentService.set('contact', 'content', tempData);
      if (success) {
        setContactData(tempData);
        setIsEditing(false);
        toast({
          title: "Contact Page Updated",
          description: "Contact page content has been updated successfully."
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact page",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempData(contactData);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.gender || !formData.email || !formData.phone || !formData.destination || !formData.planningDates || !formData.travelType) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number is exactly 10 digits
    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter exactly 10 digits",
        variant: "destructive"
      });
      return;
    }

    const message = encodeURIComponent(`*Trip Enquiry*

Name: ${formData.name}
Gender: ${formData.gender}
Email: ${formData.email}
Phone: ${formData.phone}
Destination: ${formData.destination}
Planning Dates: ${formData.planningDates}
Travel Type: ${formData.travelType}
Number of Travelers: ${formData.numberOfTravelers || 'Not specified'}`);
    
    window.open(`https://wa.me/919966996863?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp opened!",
      description: "Your trip enquiry has been sent to WhatsApp."
    });

    setFormData({
      name: "",
      gender: "",
      email: "",
      phone: "",
      destination: "",
      planningDates: "",
      travelType: "",
      numberOfTravelers: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow 10 digits
    if (name === 'phone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({
        ...formData,
        [name]: limitedDigits
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      gender: "",
      email: "",
      phone: "",
      destination: "",
      planningDates: "",
      travelType: "",
      numberOfTravelers: ""
    });
    toast({
      title: "Form cleared",
      description: "All fields have been reset."
    });
  };

  const updateContactInfo = (index: number, field: string, value: string) => {
    const newContactInfo = [...tempData.contactInfo];
    if (field === 'details') {
      newContactInfo[index].details = value.split('\n').filter(d => d.trim());
    } else {
      newContactInfo[index] = { ...newContactInfo[index], [field]: value };
    }
    setTempData({ ...tempData, contactInfo: newContactInfo });
  };

  const updateBusinessHours = (index: number, field: 'day' | 'hours', value: string) => {
    const newHours = [...tempData.businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setTempData({ ...tempData, businessHours: newHours });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQs = [...tempData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setTempData({ ...tempData, faqs: newFAQs });
  };

  const contactIcons = [Phone, Mail, MapPin, MessageCircle];

  return (
    <div className="min-h-screen">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-20 right-4 z-50">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Page
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={saveContactData}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-hero text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isEditing ? (
            <Input
              value={tempData.heroTitle}
              onChange={(e) => setTempData({ ...tempData, heroTitle: e.target.value })}
              className="text-4xl md:text-6xl font-bold mb-6 bg-white/10 text-white border-white/30 text-center"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {contactData.heroTitle}
            </h1>
          )}
          
          {isEditing ? (
            <Textarea
              value={tempData.heroDescription}
              onChange={(e) => setTempData({ ...tempData, heroDescription: e.target.value })}
              className="text-xl md:text-2xl bg-white/10 text-white border-white/30 min-h-[100px]"
            />
          ) : (
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {contactData.heroDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-muted"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.contactInfo?.map((info, index) => {
              const IconComponent = contactIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <IconComponent className="h-12 w-12 text-primary mx-auto mb-2" />
                      {isEditing ? (
                        <Input
                          value={tempData.contactInfo[index]?.title || ''}
                          onChange={(e) => updateContactInfo(index, 'title', e.target.value)}
                          className="text-lg font-semibold text-center"
                        />
                      ) : (
                        <CardTitle className="text-lg">{info.title}</CardTitle>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isEditing ? (
                        <Textarea
                          value={tempData.contactInfo[index]?.details.join('\n') || ''}
                          onChange={(e) => updateContactInfo(index, 'details', e.target.value)}
                          className="font-medium min-h-[60px]"
                          placeholder="Enter details (one per line)"
                        />
                      ) : (
                        info.details?.map((detail, i) => (
                          <p key={i} className="font-medium text-foreground">{detail}</p>
                        ))
                      )}
                      
                      {isEditing ? (
                        <Textarea
                          value={tempData.contactInfo[index]?.description || ''}
                          onChange={(e) => updateContactInfo(index, 'description', e.target.value)}
                          className="text-sm min-h-[40px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Send className="h-6 w-6 text-primary mr-2" />
                    Trip Enquiry
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Help us serve you better by filling out our quick enquiry form. Share your travel dates, preferences, and ideas, and our team will get back with a perfect itinerary just for you!
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Gender *
                      </label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleRadioChange('gender', value)}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Prefer not to say" id="prefer-not" />
                          <Label htmlFor="prefer-not">Prefer not to say</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        title="Please enter exactly 10 digits"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Destination *
                      </label>
                      <Input
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Where would you like to go?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Planning Dates *
                      </label>
                      <Input
                        name="planningDates"
                        type="date"
                        value={formData.planningDates}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Travel Type *
                      </label>
                      <RadioGroup
                        value={formData.travelType}
                        onValueChange={(value) => handleRadioChange('travelType', value)}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Group Travel" id="group" />
                          <Label htmlFor="group">Group Travel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Customized Plan" id="custom" />
                          <Label htmlFor="custom">Customized Plan</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Travelers
                      </label>
                      <Input
                        name="numberOfTravelers"
                        type="number"
                        value={formData.numberOfTravelers}
                        onChange={handleInputChange}
                        placeholder="How many people?"
                        min="1"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="flex-1" variant="adventure">
                        Submit
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={clearForm} variant="outline" className="flex-1">
                        Clear Form
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Never submit passwords through this form.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl">Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactData.faqs?.map((faq, index) => (
                    <div key={index}>
                      {isEditing ? (
                        <>
                          <Input
                            value={tempData.faqs[index]?.question || ''}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            className="font-medium mb-2"
                            placeholder="Question"
                          />
                          <Textarea
                            value={tempData.faqs[index]?.answer || ''}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            className="text-sm min-h-[60px]"
                            placeholder="Answer"
                          />
                        </>
                      ) : (
                        <>
                          <h4 className="font-medium mb-1">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;