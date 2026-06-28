import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Award, Users, Globe, Heart, Target, Eye, Edit3, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { siteContentService } from "@/lib/databaseService";

interface AboutData {
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyDescription: string;
  vision: string;
  mission: string;
  impactTitle: string;
  impactDescription: string;
  valuesTitle: string;
  valuesDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  stats: Array<{ number: string; label: string }>;
  values: Array<{ title: string; description: string }>;
}

const About = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [aboutData, setAboutData] = useState<AboutData>({
    heroTitle: "About Trek A Tour",
    heroDescription: "We're passionate adventurers dedicated to creating unforgettable experiences that connect you with nature and push your boundaries.",
    storyTitle: "Our Story",
    storyDescription: "Founded by a group of passionate adventurers, Trek A Tour began as a dream to make incredible outdoor experiences accessible to everyone. What started as weekend trips with friends has grown into India's most trusted adventure travel company.",
    vision: "To inspire a world where everyone has the opportunity to explore, discover, and connect with the incredible beauty of our planet.",
    mission: "To provide safe, sustainable, and transformative adventure experiences that create lasting memories and foster a deep connection with nature.",
    impactTitle: "Our Impact",
    impactDescription: "Over the years, we've built a community of adventurers and created countless memories.",
    valuesTitle: "Our Values",
    valuesDescription: "These core values guide everything we do and shape every adventure we create.",
    ctaTitle: "Ready to Start Your Adventure?",
    ctaDescription: "Join our community of adventurers and discover what you're truly capable of.",
    stats: [
      { number: "50,000+", label: "Happy Travelers" },
      { number: "1,000+", label: "Adventures Completed" },
      { number: "50+", label: "Destinations" },
      { number: "10+", label: "Years of Experience" }
    ],
    values: [
      { title: "Passion for Adventure", description: "We live and breathe adventure, bringing that passion to every journey we craft." },
      { title: "Community First", description: "Building a community of adventurers who share experiences and create lasting friendships." },
      { title: "Safety Always", description: "Your safety is our top priority with certified guides and quality equipment." },
      { title: "Sustainable Tourism", description: "Promoting responsible travel that benefits local communities and preserves nature." }
    ]
  });

  const [tempData, setTempData] = useState(aboutData);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await siteContentService.get('about', 'content');
      if (data) {
        let parsedData = data;
        
        // If it's a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (error) {
            console.warn('Failed to parse About page JSON string:', error);
            return;
          }
        }
        
        if (parsedData && typeof parsedData === 'object') {
          // Merge with defaults to ensure all fields exist
          const mergedData = {
            heroTitle: parsedData.heroTitle || aboutData.heroTitle,
            heroDescription: parsedData.heroDescription || aboutData.heroDescription,
            storyTitle: parsedData.storyTitle || aboutData.storyTitle,
            storyDescription: parsedData.storyDescription || aboutData.storyDescription,
            vision: parsedData.vision || aboutData.vision,
            mission: parsedData.mission || aboutData.mission,
            impactTitle: parsedData.impactTitle || aboutData.impactTitle,
            impactDescription: parsedData.impactDescription || aboutData.impactDescription,
            stats: Array.isArray(parsedData.stats) && parsedData.stats.length > 0 ? parsedData.stats : aboutData.stats,
            valuesTitle: parsedData.valuesTitle || aboutData.valuesTitle,
            valuesDescription: parsedData.valuesDescription || aboutData.valuesDescription,
            values: Array.isArray(parsedData.values) && parsedData.values.length > 0 ? parsedData.values : aboutData.values,
            ctaTitle: parsedData.ctaTitle || aboutData.ctaTitle,
            ctaDescription: parsedData.ctaDescription || aboutData.ctaDescription
          };
          setAboutData(mergedData);
          setTempData(mergedData);
        }
      }
      // If no data or invalid data, keep the default values
    } catch (error) {
      console.error('Failed to load about data:', error);
      // Keep default data on error
    }
  };

  const saveAboutData = async () => {
    try {
      const success = await siteContentService.set('about', 'content', tempData);
      if (success) {
        setAboutData(tempData);
        setIsEditing(false);
        toast({
          title: "About Page Updated",
          description: "About page content has been updated successfully."
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update about page",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempData(aboutData);
    setIsEditing(false);
  };

  const updateStat = (index: number, field: 'number' | 'label', value: string) => {
    const newStats = [...tempData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setTempData({ ...tempData, stats: newStats });
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = [...tempData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setTempData({ ...tempData, values: newValues });
  };

  const valueIcons = [Heart, Users, Target, Globe];

  return (
    <>
      <SEO 
        title="About Us - Trek A Tour"
        description={aboutData.heroDescription}
        keywords="about trek a tour, adventure travel company, trekking company india, outdoor experiences, travel mission"
      />
      <div className="min-h-screen">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="fixed top-20 right-4 z-50">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Page
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={saveAboutData}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-adventure text-white py-24"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {isEditing ? (
              <Input
                value={tempData.heroTitle}
                onChange={(e) => setTempData({ ...tempData, heroTitle: e.target.value })}
                className="text-4xl md:text-6xl font-bold mb-6 bg-white/10 text-white border-white/30 text-center"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {aboutData.heroTitle}
              </h1>
            )}
            
            {isEditing ? (
              <Textarea
                value={tempData.heroDescription}
                onChange={(e) => setTempData({ ...tempData, heroDescription: e.target.value })}
                className="text-xl md:text-2xl bg-white/10 text-white border-white/30 min-h-[100px]"
              />
            ) : (
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                {aboutData.heroDescription}
              </p>
            )}
          </div>
        </motion.section>

        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-background"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {isEditing ? (
                <Input
                  value={tempData.storyTitle}
                  onChange={(e) => setTempData({ ...tempData, storyTitle: e.target.value })}
                  className="text-3xl md:text-4xl font-bold mb-6 text-center"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{aboutData.storyTitle}</h2>
              )}
              
              {isEditing ? (
                <Textarea
                  value={tempData.storyDescription}
                  onChange={(e) => setTempData({ ...tempData, storyDescription: e.target.value })}
                  className="text-lg min-h-[100px]"
                />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutData.storyDescription}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    {isEditing ? (
                      <Textarea
                        value={tempData.vision}
                        onChange={(e) => setTempData({ ...tempData, vision: e.target.value })}
                        className="min-h-[80px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">{aboutData.vision}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                    {isEditing ? (
                      <Textarea
                        value={tempData.mission}
                        onChange={(e) => setTempData({ ...tempData, mission: e.target.value })}
                        className="min-h-[80px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">{aboutData.mission}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-card p-8 rounded-lg shadow-medium">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-3" />
                    Certified and experienced guides
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    Small group sizes for personalized experiences
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-5 w-5 text-primary mr-3" />
                    Sustainable and responsible tourism practices
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-muted"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {isEditing ? (
                <Input
                  value={tempData.impactTitle}
                  onChange={(e) => setTempData({ ...tempData, impactTitle: e.target.value })}
                  className="text-3xl md:text-4xl font-bold mb-4 text-center"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.impactTitle}</h2>
              )}
              
              {isEditing ? (
                <Textarea
                  value={tempData.impactDescription}
                  onChange={(e) => setTempData({ ...tempData, impactDescription: e.target.value })}
                  className="text-lg"
                />
              ) : (
                <p className="text-lg text-muted-foreground">{aboutData.impactDescription}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {aboutData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={tempData.stats[index]?.number || ''}
                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                        className="text-3xl md:text-4xl font-bold text-center"
                      />
                      <Input
                        value={tempData.stats[index]?.label || ''}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="text-sm md:text-base text-center"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                      <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {isEditing ? (
                <Input
                  value={tempData.valuesTitle}
                  onChange={(e) => setTempData({ ...tempData, valuesTitle: e.target.value })}
                  className="text-3xl md:text-4xl font-bold mb-4 text-center"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.valuesTitle}</h2>
              )}
              
              {isEditing ? (
                <Textarea
                  value={tempData.valuesDescription}
                  onChange={(e) => setTempData({ ...tempData, valuesDescription: e.target.value })}
                  className="text-lg"
                />
              ) : (
                <p className="text-lg text-muted-foreground">{aboutData.valuesDescription}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.values.map((value, index) => {
                const IconComponent = valueIcons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-6 bg-card rounded-lg shadow-soft hover:shadow-medium transition-shadow"
                  >
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    {isEditing ? (
                      <>
                        <Input
                          value={tempData.values[index]?.title || ''}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                          className="text-xl font-semibold mb-3 text-center"
                        />
                        <Textarea
                          value={tempData.values[index]?.description || ''}
                          onChange={(e) => updateValue(index, 'description', e.target.value)}
                          className="text-sm min-h-[80px]"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground text-sm">{value.description}</p>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-gradient-adventure text-white text-center"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isEditing ? (
              <Input
                value={tempData.ctaTitle}
                onChange={(e) => setTempData({ ...tempData, ctaTitle: e.target.value })}
                className="text-3xl md:text-4xl font-bold mb-4 bg-white/10 text-white border-white/30 text-center"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.ctaTitle}</h2>
            )}
            
            {isEditing ? (
              <Textarea
                value={tempData.ctaDescription}
                onChange={(e) => setTempData({ ...tempData, ctaDescription: e.target.value })}
                className="text-xl mb-8 bg-white/10 text-white border-white/30"
              />
            ) : (
              <p className="text-xl mb-8 opacity-90">{aboutData.ctaDescription}</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default About;