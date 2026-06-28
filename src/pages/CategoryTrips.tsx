import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useLocation } from "react-router-dom";
import TripSection from "@/components/TripSection";
import CategoryHero from "@/components/CategoryHero";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { tripService, Trip } from "@/lib/dataService";
import { PageLoader } from "@/components/LoadingSpinner";

const CategoryTrips = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Map URL paths to actual category names in the database
  const getCategoryName = (path: string) => {
    const p = path.toLowerCase();
    if (p.includes('himachal')) return 'Himachal Trips';
    if (p.includes('himalayan')) return 'Himalayan Expeditions';
    if (p.includes('weekend')) return 'Weekend Getaway';
    if (p.includes('backpacking')) return 'Backpacking Trips';
    if (p.includes('camping')) return 'Camping Escapes';
    if (p.includes('adventure')) return 'Adventure Activities';
    if (p.includes('international')) return 'International Gateways';
    return '';
  };

  // Get a clean key for the hero content (e.g., 'himachal', 'weekends')
  const getCategoryKey = (path: string) => {
    const p = path.toLowerCase();
    if (p.includes('himachal')) return 'himachal';
    if (p.includes('himalayan')) return 'himalayan';
    if (p.includes('weekend')) return 'weekends';
    if (p.includes('backpacking')) return 'backpacking';
    if (p.includes('camping')) return 'camping';
    if (p.includes('international')) return 'international';
    return 'adventure';
  };

  const categoryName = getCategoryName(location.pathname);
  const categoryKey = getCategoryKey(location.pathname);

  useEffect(() => {
    if (categoryName) {
      loadTrips();
    } else {
      setLoading(false);
    }
  }, [categoryName]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getByCategory(categoryName);
      setTrips(data);
    } catch (error) {
      console.error('Failed to load category trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <CategoryHero
        category={categoryKey}
        defaultTitle={categoryKey === 'himachal' ? "Himachal Trips" : (categoryName || "Our Adventures")}
        defaultDescription={`Explore our handpicked ${categoryName.toLowerCase()} for your next journey.`}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-16"
      >
        <TripSection
          title={
            categoryKey === 'himachal' ? 
            <>Himachal <span className="text-orange-600">Trips</span></> :
            <>{categoryName.split(' ')[0]} <span className="text-orange-600">{categoryName.split(' ').slice(1).join(' ')}</span></>
          }
          subtitle=""
          trips={trips}
          viewAllPath={location.pathname}
          maxDisplay={50}
          onTripDeleted={loadTrips}
        />
      </motion.div>

      <RecommendationsSection />
    </div>
  );
};

export default CategoryTrips;
