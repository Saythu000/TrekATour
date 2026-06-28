import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Trip, tripService, RecommendationsContent, recommendationsContentService } from '@/lib/dataService';
import { OptimizedImage } from '@/components/OptimizedImage';
import { TouchButton } from '@/components/TouchButton';
import { useNavigate } from 'react-router-dom';
import { getTripUrl } from '@/utils/slugUtils';

export const RecommendationsSection = () => {
  const [recommendedTrips, setRecommendedTrips] = useState<Trip[]>([]);
  const [content, setContent] = useState<RecommendationsContent>({
    title: 'Recommended Adventures',
    description: 'Handpicked experiences that our adventurers love most. These trips offer the perfect blend of excitement, beauty, and unforgettable memories.'
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching of scroller content
      const [trips, sectionContent] = await Promise.all([
        tripService.getRecommended(),
        recommendationsContentService.get()
      ]);
      setRecommendedTrips(trips.slice(0, 6)); // Limit to 6 trips
      setContent(sectionContent);
    } catch (error) {
      console.error('Error loading recommendations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = (trip: Trip) => {
    navigate(getTripUrl(trip));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendedTrips.length === 0) {
    return null; // Don't show section if no recommended trips
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title.includes('Adventures') ? (
              <>
                {content.title.replace(' Adventures', '')} <span className="text-orange-600">Adventures</span>
              </>
            ) : (
              <span className="text-orange-600">{content.title}</span>
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        {/* Trip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleTripClick(trip)}
            >
              {/* Trip Image */}
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage
                  src={trip.image_url || '/placeholder.svg'}
                  alt={trip.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {trip.category}
                  </span>
                </div>

                {/* Recommended Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Recommended
                  </div>
                </div>
              </div>

              {/* Trip Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {trip.title}
                </h3>
                
                <div className="text-gray-600 text-sm mb-4 line-clamp-2 whitespace-pre-wrap">
                  {trip.short_desc}
                </div>

                {/* Trip Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{trip.duration}</span>
                  </div>
                  {trip.difficulty && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{trip.difficulty}</span>
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{trip.base_price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">per person</span>
                  </div>
                  
                  <TouchButton
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-1"
                    haptic="light"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </TouchButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {recommendedTrips.length >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <TouchButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/adventure')}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              haptic="medium"
            >
              View All Adventures
            </TouchButton>
          </motion.div>
        )}
      </div>
    </section>
  );
};
