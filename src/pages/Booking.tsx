import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Star, Clock, ExternalLink } from "lucide-react";
import BookingForm from "@/components/BookingForm";

interface Package {
  id: number;
  title: string;
  duration: string;
  difficulty: string;
  price: string;
  rating: number;
  image: string;
  highlights: string[];
}

const Booking = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookingForm = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdII_96OTMFddct_LBamMjNhmXwJPekTa67dmu45r03qTDfag/viewform", "_blank");
  };

  const handlePackageBooking = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowBookingForm(true);
  };

  const packages: Package[] = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Book Your Adventure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose from our carefully curated adventure packages or create a custom experience tailored to your preferences.
          </p>
          <Button onClick={handleBookingForm} size="lg" variant="hero">
            <ExternalLink className="mr-2 h-5 w-5" />
            Start Booking Process
          </Button>
        </div>
      </section>

      {/* Booking Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Flexible Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Choose from multiple departure dates throughout the year. We offer trips in all seasons.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Group & Solo Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Join our group adventures or book private trips for you and your friends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Expert Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  All trips include experienced local guides and safety equipment.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Popular Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Adventure Packages</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge variant="secondary" className="mb-2">
                        {pkg.difficulty}
                      </Badge>
                      <h3 className="font-semibold">{pkg.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{pkg.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {highlight}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{pkg.price}</span>
                      <Button 
                        onClick={() => handlePackageBooking(pkg)} 
                        size="sm" 
                        style={{ backgroundColor: '#f97316', color: 'white' }}
                        className="hover:!bg-orange-600"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">How to Book</CardTitle>
              <CardDescription className="text-center">
                Simple steps to secure your adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Choose Package</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred adventure from our curated packages
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Fill Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete the booking form with your preferences and requirements
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed itinerary and payment instructions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Adventure!</h3>
                  <p className="text-sm text-muted-foreground">
                    Pack your bags and get ready for an unforgettable experience
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button onClick={() => setShowBookingForm(true)} size="lg" variant="hero">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Start Your Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form Modal/Section */}
          {showBookingForm && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Complete Your Booking</h2>
                <p className="text-muted-foreground">
                  Fill in your details below to proceed with your adventure booking
                </p>
              </div>
              <BookingForm selectedPackage={selectedPackage} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Booking;