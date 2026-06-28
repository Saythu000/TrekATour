import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { siteContentService } from "@/lib/databaseService";

interface TermsData {
  title: string;
  description: string;
  lastUpdated: string;
  content: string;
}

const Terms = () => {
  const { toast } = useToast();
  const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isEditing, setIsEditing] = useState(false);

  const [termsData, setTermsData] = useState<TermsData>({
    title: "Terms of Service",
    description: "Please read these terms carefully before using our services. By booking with us, you agree to these terms and conditions.",
    lastUpdated: "December 2024",
    content: `## Booking Terms

- All bookings are subject to availability and confirmation
- A deposit is required to secure your booking
- Full payment must be made 30 days before departure
- Prices are subject to change until booking is confirmed
- Group discounts apply for 6 or more participants

## Cancellation Policy

- Cancellations made 45+ days before departure: Full refund minus processing fee
- Cancellations made 30-44 days before departure: 50% refund
- Cancellations made 15-29 days before departure: 25% refund
- Cancellations made less than 15 days before departure: No refund

## Travel Requirements

- Valid passport required for international trips
- Travel insurance is mandatory for all participants
- Medical fitness certificate may be required for challenging trips
- Participants must be 18+ or accompanied by a guardian

## Liability and Responsibility

- Trek A Tour acts as an agent for various service providers
- We are not liable for delays, cancellations, or changes due to circumstances beyond our control
- Participants engage in activities at their own risk
- Travel insurance is strongly recommended

## Code of Conduct

- Respect local customs, culture, and environment
- Follow guide instructions at all times
- No alcohol or drugs during trips
- Inappropriate behavior may result in trip termination without refund

## Contact Information

For questions about these terms, contact us at terms@trekatour.com or +91 98765 43210.`
  });

  const [tempData, setTempData] = useState(termsData);

  useEffect(() => {
    loadTermsData();
  }, []);

  const loadTermsData = async () => {
    try {
      const data = await siteContentService.get('terms', 'content');
      if (data) {
        let parsedData = data;
        
        // If it's a string, try to parse it as JSON
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (error) {
            console.warn('Failed to parse Terms JSON string:', error);
            return;
          }
        }
        
        if (parsedData && typeof parsedData === 'object') {
          const mergedData = {
            title: parsedData.title || termsData.title,
            description: parsedData.description || termsData.description,
            lastUpdated: parsedData.lastUpdated || termsData.lastUpdated,
            content: parsedData.content || termsData.content
          };
          setTermsData(mergedData);
          setTempData(mergedData);
        }
      }
    } catch (error) {
      console.error('Failed to load terms data:', error);
    }
  };

  const saveTermsData = async () => {
    try {
      const success = await siteContentService.set('terms', 'content', tempData);
      if (success) {
        setTermsData(tempData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Terms of service updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save terms of service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save terms of service",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTempData(termsData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-adventure text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Scale className="h-16 w-16 mx-auto mb-6 text-white/80" />
          
          {/* Admin Edit Controls - More visible position */}
          {isAdmin && (
            <div className="mb-6">
              <div className="flex justify-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={saveTermsData}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Terms of Service
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
                    Edit Terms of Service
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
              {termsData.title}
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
              {termsData.description}
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
              <p className="text-muted-foreground">Last updated: {termsData.lastUpdated}</p>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            {isEditing ? (
              <Textarea
                value={tempData.content}
                onChange={(e) => setTempData({...tempData, content: e.target.value})}
                className="min-h-[600px] text-base leading-relaxed"
                placeholder="Terms of service content (supports Markdown)"
              />
            ) : (
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {termsData.content}
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Terms;