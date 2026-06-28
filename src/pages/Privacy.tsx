import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { siteContentService } from "@/lib/databaseService";

interface PrivacyData {
  title: string;
  description: string;
  lastUpdated: string;
  content: string;
}

const Privacy = () => {
  const { toast } = useToast();
  const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isEditing, setIsEditing] = useState(false);

  const [privacyData, setPrivacyData] = useState<PrivacyData>({
    title: "Privacy Policy",
    description: "Your privacy and data security are our top priorities. Learn how we protect and use your information.",
    lastUpdated: "December 2024",
    content: `## Information We Collect

We collect information you provide directly to us, such as when you create an account, book a trip, or contact us for support. This may include your name, email address, phone number, payment information, and travel preferences.

## How We Use Your Information

We use the information we collect to:
- Process your bookings and payments
- Communicate with you about your trips
- Provide customer support
- Send you marketing communications (with your consent)
- Improve our services

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
- Service providers who assist us in operating our website and conducting our business
- Legal authorities when required by law

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications

## Contact Us

If you have any questions about this Privacy Policy, please contact us at privacy@trekatour.com`
  });

  const [tempData, setTempData] = useState(privacyData);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      const data = await siteContentService.get('privacy', 'content');
      if (data) {
        let parsedData = data;
        
        // If it's a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (error) {
            console.warn('Failed to parse Privacy JSON string:', error);
            return;
          }
        }
        
        if (parsedData && typeof parsedData === 'object') {
          const mergedData = {
            title: parsedData.title || privacyData.title,
            description: parsedData.description || privacyData.description,
            lastUpdated: parsedData.lastUpdated || privacyData.lastUpdated,
            content: parsedData.content || privacyData.content
          };
          setPrivacyData(mergedData);
          setTempData(mergedData);
        }
      }
    } catch (error) {
      console.error('Failed to load privacy data:', error);
    }
  };

  const savePrivacyData = async () => {
    try {
      const success = await siteContentService.set('privacy', 'content', tempData);
      if (success) {
        setPrivacyData(tempData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Privacy policy updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save privacy policy",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy policy",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempData(privacyData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-hero text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Shield className="h-16 w-16 mx-auto mb-6 text-white/80" />
          
          {/* Admin Edit Controls - More visible position */}
          {isAdmin && (
            <div className="mb-6">
              <div className="flex justify-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={savePrivacyData}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Privacy Policy
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Privacy Policy
                  </Button>
                )}
              </div>
            </div>
          )}

          {isEditing ? (
            <Input
              value={tempData.title}
              onChange={(e) => setTempData({...tempData, title: e.target.value})}
              className="text-4xl md:text-6xl font-bold mb-6 bg-white/10 border-white/20 text-white text-center"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {privacyData.title}
            </h1>
          )}

          {isEditing ? (
            <Textarea
              value={tempData.description}
              onChange={(e) => setTempData({...tempData, description: e.target.value})}
              className="text-xl md:text-2xl opacity-90 leading-relaxed bg-white/10 border-white/20 text-white"
              rows={3}
            />
          ) : (
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {privacyData.description}
            </p>
          )}
        </div>
      </motion.section>

      {/* Content */}
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
                value={tempData.lastUpdated}
                onChange={(e) => setTempData({...tempData, lastUpdated: e.target.value})}
                className="text-center text-muted-foreground w-auto mx-auto"
                placeholder="Last updated date"
              />
            ) : (
              <p className="text-muted-foreground">Last updated: {privacyData.lastUpdated}</p>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            {isEditing ? (
              <Textarea
                value={tempData.content}
                onChange={(e) => setTempData({...tempData, content: e.target.value})}
                className="min-h-[600px] text-base leading-relaxed"
                placeholder="Privacy policy content (supports Markdown)"
              />
            ) : (
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {privacyData.content}
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Privacy;