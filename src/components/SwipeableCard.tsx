import { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Heart, Share2, MapPin, Clock, Users, Star } from 'lucide-react';
import { useSwipeGesture, useHapticFeedback } from '@/hooks/useTouchGestures';
import { OptimizedImage } from '@/components/OptimizedImage';
import { TouchButton } from '@/components/TouchButton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  trip: {
    id: string;
    title: string;
    image_url?: string;
    base_price: number;
    duration?: string;
    difficulty?: string;
    location?: string;
    rating?: number;
    category?: string;
  };
  onView?: (tripId: string) => void;
  onBookmark?: (tripId: string) => void;
  onShare?: (tripId: string) => void;
  className?: string;
}

export const SwipeableCard = ({
  trip,
  onView,
  onBookmark,
  onShare,
  className
}: SwipeableCardProps) => {
  const [dragX, setDragX] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { lightTap, mediumTap } = useHapticFeedback();

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - bookmark
      handleBookmark();
      mediumTap();
    } else if (info.offset.x < -threshold) {
      // Swiped left - share
      handleShare();
      mediumTap();
    }
    
    setDragX(0);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(trip.id);
    lightTap();
  };

  const handleShare = () => {
    onShare?.(trip.id);
    lightTap();
  };

  const handleView = () => {
    onView?.(trip.id);
    lightTap();
  };

  return (
    <div ref={constraintsRef} className={cn('relative overflow-hidden', className)}>
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex">
        {/* Left action (bookmark) */}
        <div className="flex-1 bg-green-500 flex items-center justify-start pl-6">
          <div className="flex items-center space-x-2 text-white">
            <Heart className="w-6 h-6" />
            <span className="font-medium">Bookmark</span>
          </div>
        </div>
        
        {/* Right action (share) */}
        <div className="flex-1 bg-blue-500 flex items-center justify-end pr-6">
          <div className="flex items-center space-x-2 text-white">
            <span className="font-medium">Share</span>
            <Share2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onDrag={(event, info) => setDragX(info.offset.x)}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
        whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <OptimizedImage
            src={trip.image_url || '/placeholder.svg'}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Category badge */}
          {trip.category && (
            <Badge className="absolute top-3 left-3 bg-white/90 text-orange-600 font-semibold">
              {trip.category}
            </Badge>
          )}
          
          {/* Bookmark button */}
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="absolute top-3 right-3 bg-white/90 text-gray-700 hover:bg-white rounded-full w-10 h-10 p-0"
            haptic="light"
          >
            <Heart className={cn(
              'w-4 h-4 transition-colors',
              isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            )} />
          </TouchButton>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 mr-2">
              {trip.title}
            </h3>
            {trip.rating && (
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {trip.rating}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          {trip.location && (
            <div className="flex items-center space-x-1 text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{trip.location}</span>
            </div>
          )}

          {/* Trip Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              {trip.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{trip.duration}</span>
                </div>
              )}
              {trip.difficulty && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{trip.difficulty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Action */}
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
              onClick={handleView}
              className="px-4 py-2"
              haptic="medium"
            >
              View Details
            </TouchButton>
          </div>
        </div>

        {/* Swipe Indicator */}
        {Math.abs(dragX) > 20 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="bg-white/90 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                {dragX > 0 ? '← Swipe to bookmark' : 'Swipe to share →'}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
