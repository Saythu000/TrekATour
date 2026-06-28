import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Trip, tripService } from "@/lib/dataService";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { getTripUrl } from "@/utils/slugUtils";

interface TripSectionProps {
  title: string;
  subtitle: string;
  trips: Trip[];
  viewAllPath: string;
  maxDisplay?: number;
  onTripDeleted?: () => void;
}

const TripSection = ({ title, subtitle, trips, viewAllPath, maxDisplay = 6, onTripDeleted }: TripSectionProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  // Show trips from Supabase
  const displayTrips = maxDisplay ? trips.slice(0, maxDisplay) : trips;

  const handleViewDetails = (trip: Trip) => {
    navigate(getTripUrl(trip));
  };

  const handleViewAll = () => {
    navigate(viewAllPath);
  };

  const handleDeleteTrip = async (trip: Trip, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    // Check if this is a UUID (Supabase trip) or old local storage trip
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trip.id);
    
    if (!isUUID) {
      toast({
        title: "Cannot Delete",
        description: "This is an old trip from local storage. Please migrate to Supabase first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm(`Delete "${trip.title}"? This will permanently remove it from Supabase!`)) return;
    
    try {
      const success = await tripService.delete(trip.id);
      if (success) {
        toast({
          title: "Deleted",
          description: `"${trip.title}" removed from Supabase`,
        });
        onTripDeleted?.(); // Refresh the trips list
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    }
  };

  if (displayTrips.length === 0) {
    return null; // Don't render section if no trips
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayTrips.map((trip) => (
            <Card 
              key={trip.id} 
              className="group hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 overflow-hidden border-0 shadow-lg cursor-pointer"
              onClick={() => handleViewDetails(trip)}
            >
              <CardHeader className="p-0">
                <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                  {/* Trip Image */}
                  {(() => {
                    const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
                    const imageUrl = localImage || trip.image_url || trip.hero_images?.[0];
                    
                    return imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : null;
                  })()}
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-orange-600 font-semibold">
                      {trip.category}
                    </Badge>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDeleteTrip(trip, e);
                        }}
                        title="Delete Trip (Admin Only)"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <CardTitle className="text-white text-xl font-bold mb-2 line-clamp-2">
                      {trip.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  {trip.duration && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{trip.duration}</span>
                    </div>
                  )}
                  
                  {trip.short_desc && (
                    <div className="text-muted-foreground text-sm line-clamp-2 whitespace-pre-wrap">
                      {trip.short_desc}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    {trip.base_price && (
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{trip.base_price}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleViewDetails(trip);
                  }}
                  style={{ backgroundColor: '#ea580c', color: 'white' }}
                  className="w-full hover:!bg-orange-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {trips.length > maxDisplay && (
          <div className="text-center">
            <Button 
              onClick={handleViewAll}
              variant="outline" 
              size="lg"
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View All {title}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TripSection;
