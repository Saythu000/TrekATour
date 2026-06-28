import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useSwipeGesture, usePinchZoom, useHapticFeedback } from '@/hooks/useTouchGestures';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose?: () => void;
  className?: string;
}

export const MobileImageGallery = ({
  images,
  initialIndex = 0,
  onClose,
  className
}: MobileImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { lightTap, mediumTap } = useHapticFeedback();

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      lightTap();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      lightTap();
    }
  };

  const swipeGestures = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
    preventScroll: isZoomed
  });

  const pinchZoom = usePinchZoom({
    onZoomChange: (newScale) => {
      setScale(newScale);
      setIsZoomed(newScale > 1);
    },
    minScale: 1,
    maxScale: 3
  });

  const handleDoubleClick = () => {
    if (isZoomed) {
      setScale(1);
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
      setIsZoomed(true);
    }
    mediumTap();
  };

  const resetZoom = () => {
    setScale(1);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetZoom();
  }, [currentIndex]);

  return (
    <div className={cn('relative w-full h-full bg-black', className)}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center space-x-2">
          {isZoomed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        {...swipeGestures}
        {...pinchZoom}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center'
            }}
            onDoubleClick={handleDoubleClick}
          >
            <OptimizedImage
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              priority={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {!isZoomed && (
        <>
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {currentIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && !isZoomed && (
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <div className="flex justify-center space-x-2 px-4">
            <div className="flex space-x-2 overflow-x-auto max-w-full">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    lightTap();
                  }}
                  className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all',
                    index === currentIndex
                      ? 'border-white shadow-lg'
                      : 'border-white/30 opacity-70'
                  )}
                >
                  <OptimizedImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Zoom Indicator */}
      {isZoomed && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};
