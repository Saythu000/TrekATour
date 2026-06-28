import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import TripSection from "@/components/TripSection";
import { HomeSEO } from "@/components/SEOHead";
import { tripService, Trip } from "@/lib/dataService";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RecommendationsSection } from "@/components/RecommendationsSection";

const Index = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive();
      setTrips(data);
      console.log(`🏠 Homepage loaded ${data.length} active trips from Supabase:`, data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Function to get trips by category
  const getTripsByCategory = (categories: string[]) => {
    return trips.filter(trip => 
      categories.some(cat => trip.category.toLowerCase().includes(cat.toLowerCase()))
    );
  };

  // Get categorized trips
  const displayUpcomingTrips = getTripsByCategory(['Adventure', 'Water Sports', 'Workshop', 'Trekking', 'Cultural', 'Cycling', 'Hill Station', 'Desert Safari', 'Group Tours']);
  const displayWeekendTrips = getTripsByCategory(['Weekend Getaways', 'Weekend']);
  const displayHimalayanTrips = getTripsByCategory(['Himalayan', 'Himalayan Treks']);
  const displayBackpackingTrips = getTripsByCategory(['Backpacking']);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeSEO />
      <div className="min-h-screen">
        {/* Hero Section with Scrolling Adventures */}
        <HeroSection />

        {/* Call to Action Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-gradient-adventure text-white text-center"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of adventurers who trust us with their most memorable journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Plan My Trip
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Recommendations Section */}
        <RecommendationsSection />
      </div>
    </>
  );
};

export default Index;
