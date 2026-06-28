import { Button } from "@/components/ui/button";
import { ArrowRight, Edit3, Save, X, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tripService, Trip } from "@/lib/dataService";
import { siteContentService } from "@/lib/databaseService";
import { imageService } from "@/lib/imageService";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getTripUrl } from "@/utils/slugUtils";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("/hero-image.jpg");
  
  // Upcoming adventures state
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [featuredTripIds, setFeaturedTripIds] = useState<string[]>([]);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  
  // Hero text state
  const [heroText, setHeroText] = useState({
    title: "Treking Adventure Touring",
    description: "Experience breathtaking journeys, create lasting memories, and push your boundaries with our expertly curated adventure packages across India."
  });
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempHeroText, setTempHeroText] = useState(heroText);

  // Swipe functionality state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = () => {
      if (!scrollContainerRef.current || isDragging || isHovered) return;
      
      const container = scrollContainerRef.current;
      const cardWidth = 320 + 24; // Card width + gap
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (currentScroll >= maxScroll - 10) {
        container.scrollLeft = 0;
      } else {
        container.scrollTo({ 
          left: currentScroll + cardWidth, 
          behavior: 'smooth' 
        });
      }
    };

    const interval = setInterval(autoScroll, 3000);
    return () => clearInterval(interval);
  }, [isDragging, isHovered]);

  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: 0.3 }
    }
  };

  // Load hero content from database
  useEffect(() => {
    loadHeroContent();
    loadTrips();
  }, []);

  // Swipe functionality handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const loadHeroContent = async () => {
    try {
      const heroTextData = await siteContentService.get('hero', 'text');
      if (heroTextData) {
        let parsedData = typeof heroTextData === 'string' ? JSON.parse(heroTextData) : heroTextData;
        if (parsedData?.title && parsedData?.description) {
          setHeroText(parsedData);
          setTempHeroText(parsedData);
        }
      }
      
      const heroImageData = await siteContentService.get('hero', 'image');
      if (heroImageData) {
        let imageUrl = typeof heroImageData === 'object' ? heroImageData.url : heroImageData;
        if (imageUrl) {
          setHeroImage(`${imageUrl}?t=${Date.now()}`);
        }
      }
    } catch (error) {
      console.error('Failed to load hero content:', error);
    }
  };

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive();
      setAllTrips(data);
      
      // Filter currently featured trips
      const featuredTrips = data.filter(trip => trip.is_featured);
      setFeaturedTripIds(featuredTrips.map(trip => trip.id));
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  const getFeaturedTrips = () => {
    return allTrips.filter(trip => featuredTripIds.includes(trip.id));
  };

  const saveFeaturedTrips = async () => {
    try {
      // Use the new bulk update method
      const { error } = await tripService.updateFeaturedTrips(featuredTripIds);
      
      if (error) throw error;
      
      // Update local state to reflect changes
      setAllTrips(prev => prev.map(trip => ({
        ...trip,
        is_featured: featuredTripIds.includes(trip.id)
      })));
      
      setIsEditingFeatured(false);
      toast({
        title: "Success",
        description: "Upcoming trips updated successfully",
      });
    } catch (error) {
      console.error('Failed to save featured trips:', error);
      toast({
        title: "Error",
        description: "Failed to update upcoming trips",
        variant: "destructive",
      });
    }
  };

  const toggleFeaturedTrip = (tripId: string) => {
    setFeaturedTripIds(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const saveHeroText = async () => {
    try {
      const success = await siteContentService.set('hero', 'text', tempHeroText);
      if (success) {
        setHeroText(tempHeroText);
        setIsEditingText(false);
        toast({
          title: "Success",
          description: "Hero text updated successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero text",
        variant: "destructive",
      });
    }
  };

  const cancelEditText = () => {
    setTempHeroText(heroText);
    setIsEditingText(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadResult = await imageService.uploadHeroImage(file, heroImage);
        if (uploadResult.success) {
          const success = await siteContentService.set('hero', 'image', uploadResult.url);
          if (success) {
            setHeroImage(`${uploadResult.url}?t=${Date.now()}`);
            setTimeout(() => loadHeroContent(), 500);
            toast({
              title: "Success",
              description: "Hero image updated successfully",
            });
          } else {
            throw new Error("Failed to save image URL");
          }
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
    setIsEditing(false);
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full"
      >
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={heroImage}
            alt="Adventure Travel"
            className="w-full h-[70vh] md:h-[80vh] lg:h-screen"
            priority={true}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="space-y-8">
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center space-y-6"
                >
                  {isEditingText ? (
                    <div className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                      <Input
                        value={tempHeroText.title}
                        onChange={(e) => setTempHeroText({...tempHeroText, title: e.target.value})}
                        className="text-2xl font-bold text-center bg-white/20 border-white/30 text-white"
                      />
                      <Textarea
                        value={tempHeroText.description}
                        onChange={(e) => setTempHeroText({...tempHeroText, description: e.target.value})}
                        className="text-center bg-white/20 border-white/30 text-white"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button onClick={saveHeroText} size="sm" className="bg-green-600">Save</Button>
                        <Button onClick={cancelEditText} size="sm" variant="outline">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight">
                          {(heroText.title || "Treking Adventure Touring").split(' ').map((word, index) => 
                            word.toLowerCase() === 'adventure' ? (
                              <span key={index} className="text-orange-500">{word} </span>
                            ) : (
                              <span key={index}>{word} </span>
                            )
                          )}
                        </h1>
                        {isAdmin && (
                          <Button
                            onClick={() => setIsEditingText(true)}
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 bg-white/20 text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="hero-description text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        {heroText.description}
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="text-white border-white/30"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Image
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <section className="py-12 bg-gradient-to-r from-orange-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Upcoming <span className="text-orange-600">Trips</span>
            </h2>
            {isAdmin && (
              <Button
                onClick={() => setIsEditingFeatured(true)}
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 mt-4"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Featured
              </Button>
            )}
          </div>
        </div>

        {getFeaturedTrips().length > 0 ? (
          <div className="relative w-full">
            <div 
              ref={scrollContainerRef}
              className="horizontal-scroll flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none px-4"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                handleMouseUp();
                setIsHovered(false);
              }}
            >
              {getFeaturedTrips().map((trip) => (
                <div
                  key={trip.id}
                  className="trip-card flex-shrink-0 w-72 sm:w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(getTripUrl(trip))}
                >
                  <div className="h-48 relative overflow-hidden flex-shrink-0">
                    <img
                      src={trip.image_url || '/placeholder.svg'}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-orange-600 font-semibold px-3 py-1 rounded-full text-sm">
                        {trip.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold line-clamp-2">{trip.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm">⏱️ {trip.duration}</p>
                      <div className="text-2xl font-bold text-orange-600">₹{trip.base_price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No upcoming trips selected</div>
        )}
      </section>

      {isEditingFeatured && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Select Upcoming Trips</h3>
              <div className="flex gap-2">
                <Button onClick={saveFeaturedTrips} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button onClick={() => setIsEditingFeatured(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    featuredTripIds.includes(trip.id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                  onClick={() => toggleFeaturedTrip(trip.id)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2">{trip.title}</h4>
                      <p className="text-xs text-gray-500">{trip.category}</p>
                      <p className="text-sm font-bold text-orange-600 mt-2">₹{trip.base_price}</p>
                    </div>
                    {featuredTripIds.includes(trip.id) && <Check className="w-5 h-5 text-orange-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Hero Image</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border mb-4" />
            <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full">Cancel</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
