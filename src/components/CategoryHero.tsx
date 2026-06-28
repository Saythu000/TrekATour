import { Button } from "@/components/ui/button";
import { Edit3, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteContentService } from "@/lib/databaseService";
import { imageService } from "@/lib/imageService";

interface CategoryHeroProps {
  category: string; // 'weekends', 'backpacking', 'camping', 'international'
  defaultTitle: string;
  defaultDescription: string;
  defaultImage?: string;
}

const CategoryHero = ({ category, defaultTitle, defaultDescription, defaultImage = "/hero-image.jpg" }: CategoryHeroProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [heroImage, setHeroImage] = useState<string>(defaultImage);
  const [heroText, setHeroText] = useState({
    title: defaultTitle,
    description: defaultDescription
  });
  
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempHeroText, setTempHeroText] = useState(heroText);

  useEffect(() => {
    loadCategoryContent();
  }, [category]);

  const loadCategoryContent = async () => {
    try {
      console.log(`🔍 Loading category content for: ${category}`);
      
      // Load category text from database
      const textData = await siteContentService.get('category', `${category}-text`);
      console.log(`📝 Category text data for ${category}:`, textData);
      
      if (textData) {
        let parsedData = textData;
        
        // If it's a string, try to parse it as JSON
        if (typeof textData === 'string') {
          try {
            parsedData = JSON.parse(textData);
            console.log(`✅ Parsed category text for ${category}:`, parsedData);
          } catch (error) {
            console.warn('Failed to parse category text JSON string:', error);
          }
        }
        
        if (parsedData && parsedData.title && parsedData.description) {
          setHeroText(parsedData);
          setTempHeroText(parsedData);
        }
      }
      
      // Load category image from database
      const imageData = await siteContentService.get('category', `${category}-image`);
      console.log(`🖼️ Category image data for ${category}:`, imageData);
      
      if (imageData) {
        let imageUrl = imageData;
        if (typeof imageData === 'object' && imageData.url) {
          imageUrl = imageData.url;
        }
        if (imageUrl && typeof imageUrl === 'string') {
          const cacheBustedUrl = `${imageUrl}?t=${Date.now()}`;
          setHeroImage(cacheBustedUrl);
          console.log(`✅ Set category image for ${category}:`, cacheBustedUrl);
        }
      }
    } catch (error) {
      console.error('Failed to load category content:', error);
    }
  };

  const saveHeroText = async () => {
    try {
      console.log(`💾 Saving category text for ${category}:`, tempHeroText);
      const success = await siteContentService.set('category', `${category}-text`, tempHeroText);
      console.log(`💾 Category text save result for ${category}:`, success);
      
      if (success) {
        setHeroText(tempHeroText);
        setIsEditingText(false);
        toast({
          title: "Success",
          description: "Category text updated successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error(`❌ Category text save error for ${category}:`, error);
      toast({
        title: "Error",
        description: "Failed to update category text",
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
        console.log(`📤 Starting category image upload for ${category}`);
        
        // Upload to Supabase Storage
        const uploadResult = await imageService.uploadHeroImage(file, heroImage);
        console.log(`📤 Category image upload result for ${category}:`, uploadResult);
        
        if (uploadResult.success) {
          console.log(`💾 Saving category image URL for ${category}:`, uploadResult.url);
          
          // Save plain URL string to database
          const success = await siteContentService.set('category', `${category}-image`, uploadResult.url);
          console.log(`💾 Category image save result for ${category}:`, success);
          
          if (success) {
            const cacheBustedUrl = `${uploadResult.url}?t=${Date.now()}`;
            setHeroImage(cacheBustedUrl);
            
            // Force component re-render
            setTimeout(() => {
              loadCategoryContent();
            }, 500);
            
            toast({
              title: "Success",
              description: "Category image updated successfully",
            });
          } else {
            throw new Error("Failed to save image URL");
          }
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error(`❌ Category image upload error for ${category}:`, error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
    setIsEditingImage(false);
  };

  return (
    <section className="relative h-96 overflow-hidden">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full h-full"
      >
        <img 
          src={heroImage}
          alt={heroText.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            {isEditingText ? (
              <div className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Input
                  value={tempHeroText.title}
                  onChange={(e) => setTempHeroText({...tempHeroText, title: e.target.value})}
                  className="text-2xl font-bold text-center bg-white/20 border-white/30 text-white placeholder-white/70"
                  placeholder="Category Title"
                />
                <Textarea
                  value={tempHeroText.description}
                  onChange={(e) => setTempHeroText({...tempHeroText, description: e.target.value})}
                  className="text-center bg-white/20 border-white/30 text-white placeholder-white/70"
                  placeholder="Category Description"
                  rows={3}
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={saveHeroText} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={cancelEditText} size="sm" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30">
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {(() => {
                    const title = heroText.title || defaultTitle;
                    console.log('CategoryHero title:', title); // Debug log
                    
                    // Handle orange text highlighting for specific words (case-insensitive and typo-tolerant)
                    if (title.toLowerCase().includes('weekend') && title.toLowerCase().includes('getaway')) {
                      return <>Weekend <span className="text-orange-600">Getaways</span></>;
                    } else if (title.toLowerCase().includes('himachal') && title.toLowerCase().includes('trip')) {
                      return <>Himachal <span className="text-orange-600">Trips</span></>;
                    } else if (title.toLowerCase().includes('himalayan') && title.toLowerCase().includes('expedition')) {
                      return <>Himalayan <span className="text-orange-600">Expeditions</span></>;
                    } else if (title.toLowerCase().includes('backpacking') && title.toLowerCase().includes('trip')) {
                      return <>Backpacking <span className="text-orange-600">Trips</span></>;
                    } else if (title.toLowerCase().includes('camping') && title.toLowerCase().includes('adventure')) {
                      return <>Camping <span className="text-orange-600">Adventures</span></>;
                    } else if (title.toLowerCase().includes('international') && (title.toLowerCase().includes('gateway') || title.toLowerCase().includes('getaway'))) {
                      return <>International <span className="text-orange-600">Getaways</span></>;
                    } else {
                      // Fallback: try to split and highlight second word in orange
                      const words = title.split(' ');
                      if (words.length >= 2) {
                        return <>{words[0]} <span className="text-orange-600">{words.slice(1).join(' ')}</span></>;
                      }
                      return title;
                    }
                  })()}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                  {heroText.description || defaultDescription}
                </p>
                
                {isAdmin && (
                  <Button
                    onClick={() => setIsEditingText(true)}
                    size="sm"
                    variant="outline"
                    className="absolute -top-2 -right-2 bg-white/20 border-white/50 text-white hover:bg-white/30"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Admin Image Edit Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20">
            <Button
              onClick={() => setIsEditingImage(true)}
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Image
            </Button>
          </div>
        )}
      </motion.div>

      {/* Image Upload Modal */}
      {isEditingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Category Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={() => setIsEditingImage(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryHero;
