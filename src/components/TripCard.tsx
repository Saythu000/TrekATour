import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { Trip } from "@/lib/dataService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { handleWhatsAppBooking } from "@/utils/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";
import { useState, useEffect } from "react";

interface TripCardProps {
  trip: Trip;
  onBook?: (trip: Trip) => void;
}

const TripCard = ({ trip, onBook }: TripCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for image first, then fallback to trip image fields
    const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
    if (localImage) {
      setImageUrl(localImage);
    } else if ((trip as any).image_url) {
      // Database trip type
      setImageUrl((trip as any).image_url);
    } else if ((trip as any).image) {
      // Data trip type
      setImageUrl((trip as any).image);
    }
  }, [trip.slug, (trip as any).image_url, (trip as any).image]);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-accent text-accent-foreground';
      case 'Moderate': return 'bg-primary text-primary-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleBookNow = () => {
    analytics.trackBookingAttempt(trip.id, 'whatsapp');
    
    if (onBook) {
      onBook(trip);
    } else {
      handleWhatsAppBooking(trip, () => {
        // Fallback: show contact form
        toast({
          title: "WhatsApp not available",
          description: "Please contact us directly at +91 98765 43210",
          duration: 5000,
        });
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-gradient-card hover:shadow-strong transition-all duration-300 border-0 overflow-hidden group">
        {/* Trip Image */}
        {imageUrl ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={trip.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={getDifficultyColor(trip.difficulty)}>
                {trip.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {trip.category}
              </Badge>
            </div>
            {/* Fallback for broken images */}
            <div className="hidden absolute inset-0 bg-gradient-adventure">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={getDifficultyColor(trip.difficulty)}>
                  {trip.difficulty}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-foreground">
                  {trip.category}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-white/60" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-adventure overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={getDifficultyColor(trip.difficulty)}>
                {trip.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {trip.category}
              </Badge>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white/60" />
            </div>
          </div>
        )}

        <CardContent className="flex-1 p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {trip.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {trip.shortDesc}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{trip.duration}</span>
              </div>
            </div>

            {trip.features && trip.features.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {trip.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {trip.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{trip.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                {/* Show original price with strikethrough if available */}
                {trip.original_price && trip.original_price > trip.base_price && (
                  <div className="text-sm text-muted-foreground line-through mb-1">
                    ₹{trip.original_price.toLocaleString()}
                  </div>
                )}
                <span className="text-2xl font-bold text-foreground">
                  ₹{trip.base_price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  per person
                </span>
                {/* Show discount percentage if applicable */}
                {trip.original_price && trip.original_price > trip.base_price && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    {Math.round(((trip.original_price - trip.base_price) / trip.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
                <Users className="h-4 w-4 ml-2" />
                <span>12+</span>
              </div>
            </div>
            
            <Button 
              style={{ backgroundColor: '#ea580c', color: 'white' }}
              className="w-full font-semibold py-2 px-4 border border-orange-700 shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handleBookNow}
              aria-label={`Book ${trip.title} via WhatsApp`}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
            >
              Book via WhatsApp
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TripCard;