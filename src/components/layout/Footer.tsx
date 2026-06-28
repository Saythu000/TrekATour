import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Edit3, Save, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { siteContentService } from "@/lib/databaseService";

const Footer = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [footerData, setFooterData] = useState({
    brandName: "TREK A TOUR",
    description: "Discover the world's most breathtaking adventures. From Himalayan peaks to jungle trails, we craft unforgettable experiences for every adventurer.",
    phone: "+91 9966996863",
    email: "trekatour@gmail.com",
    location: "Hyderabad, Telangana, India",
    services: ["Adventure Tours", "Group Bookings", "Honeymoon Packages", "Corporate Events", "Corporate Outing"],
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "Weekend Getaways", path: "/weekends" },
      { name: "Backpacking Trips", path: "/backpacking" },
      { name: "Treks", path: "/himalayan" }
    ]
  });

  const [tempFooterData, setTempFooterData] = useState(footerData);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const data = await siteContentService.get('footer', 'data');
      if (data) {
        let parsedData = data;
        
        // If it's a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (error) {
            console.warn('Failed to parse Footer JSON string:', error);
            return;
          }
        }
        
        if (parsedData && typeof parsedData === 'object') {
          // Only update fields that exist in database, keep defaults for missing fields
          const updatedData = {
            brandName: parsedData.brandName || footerData.brandName,
            description: parsedData.description || footerData.description,
            phone: parsedData.phone || footerData.phone,
            email: parsedData.email || footerData.email,
            location: parsedData.location || footerData.location,
            services: Array.isArray(parsedData.services) && parsedData.services.length > 0 ? parsedData.services : footerData.services,
            quickLinks: Array.isArray(parsedData.quickLinks) && parsedData.quickLinks.length > 0 ? parsedData.quickLinks : footerData.quickLinks
          };
          setFooterData(updatedData);
          setTempFooterData(updatedData);
        }
      }
      // If no data or invalid data, keep the default values
    } catch (error) {
      console.error('Failed to load footer data:', error);
      // Keep default data on error
    }
  };

  const saveFooterData = async () => {
    try {
      const success = await siteContentService.set('footer', 'data', tempFooterData);
      if (success) {
        setFooterData(tempFooterData);
        setIsEditing(false);
        toast({
          title: "Footer updated",
          description: "Footer content has been updated successfully."
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update footer",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempFooterData(footerData);
    setIsEditing(false);
  };

  const updateService = (index: number, value: string) => {
    const newServices = [...(tempFooterData.services || [])];
    newServices[index] = value;
    setTempFooterData({...tempFooterData, services: newServices});
  };

  const updateQuickLink = (index: number, field: 'name' | 'path', value: string) => {
    const newLinks = [...(tempFooterData.quickLinks || [])];
    newLinks[index] = {...newLinks[index], [field]: value};
    setTempFooterData({...tempFooterData, quickLinks: newLinks});
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Edit Controls */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempFooterData(footerData);
                  setIsEditing(true);
                }}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Footer
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={saveFooterData}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Input
                  value={tempFooterData.brandName}
                  onChange={(e) => setTempFooterData({...tempFooterData, brandName: e.target.value})}
                  className="text-xl font-bold bg-white text-black border-orange-300 focus:border-orange-500"
                />
              ) : (
                <span className="text-xl font-bold text-secondary-foreground">
                  {footerData.brandName}
                </span>
              )}
            </div>
            
            {/* Admin Shield Icon */}
            <div className="flex justify-start">
              {isAdmin ? (
                <Link to="/admin">
                  <Shield className="h-5 w-5 text-orange-600 hover:text-orange-700 cursor-pointer transition-colors" />
                </Link>
              ) : (
                <Link to="/admin-login">
                  <Shield className="h-5 w-5 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
                </Link>
              )}
            </div>
            
            {isEditing ? (
              <Textarea
                value={tempFooterData.description}
                onChange={(e) => setTempFooterData({...tempFooterData, description: e.target.value})}
                className="text-sm bg-white text-black border-orange-300 focus:border-orange-500 min-h-[80px]"
              />
            ) : (
              <p className="text-sm text-secondary-foreground/90">
                {footerData.description}
              </p>
            )}
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61566397745065" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/trekatour/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a 
                href="https://x.com/trekatour" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks?.map((item, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Input
                        value={tempFooterData.quickLinks[index]?.name || ''}
                        onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                        className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                        placeholder="Link name"
                      />
                      <Input
                        value={tempFooterData.quickLinks[index]?.path || ''}
                        onChange={(e) => updateQuickLink(index, 'path', e.target.value)}
                        className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                        placeholder="Link path"
                      />
                    </div>
                  ) : (
                    <Link 
                      to={item.path}
                      className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerData.services?.map((item, index) => (
                <li key={index}>
                  {isEditing ? (
                    <Input
                      value={tempFooterData.services?.[index] || ''}
                      onChange={(e) => updateService(index, e.target.value)}
                      className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                    />
                  ) : (
                    <span className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground cursor-pointer transition-colors">
                      {item}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                {isEditing ? (
                  <Input
                    value={tempFooterData.phone}
                    onChange={(e) => setTempFooterData({...tempFooterData, phone: e.target.value})}
                    className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                  />
                ) : (
                  <span className="text-sm text-secondary-foreground/90">{footerData.phone}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                {isEditing ? (
                  <Input
                    value={tempFooterData.email}
                    onChange={(e) => setTempFooterData({...tempFooterData, email: e.target.value})}
                    className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                  />
                ) : (
                  <span className="text-sm text-secondary-foreground/90">{footerData.email}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                {isEditing ? (
                  <Input
                    value={tempFooterData.location}
                    onChange={(e) => setTempFooterData({...tempFooterData, location: e.target.value})}
                    className="text-sm bg-white text-black border-orange-300 focus:border-orange-500"
                  />
                ) : (
                  <span className="text-sm text-secondary-foreground/90">{footerData.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-foreground/80">
            © 2024 Trek A Tour. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;