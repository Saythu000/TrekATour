import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Route, CheckCircle, XCircle, Shield, Info, Camera, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EditableSection from "@/components/EditableSection";
import EditableItinerary from "@/components/EditableItinerary";
import { TripSections, ItineraryDay } from "@/lib/tripSections";

interface ModernAccordionProps {
  tripSections: TripSections;
  onSectionSave: (field: keyof TripSections, content: string | string[] | ItineraryDay[]) => void;
}

const ModernAccordion = ({ tripSections, onSectionSave }: ModernAccordionProps) => {
  const [openSection, setOpenSection] = useState<string>("overview");

  const sections = [
    {
      id: "overview",
      title: "Trip Overview",
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      content: (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {tripSections.overview || "Discover an unforgettable adventure that will create memories to last a lifetime."}
          </p>
        </div>
      )
    },
    {
      id: "itinerary",
      title: "Detailed Itinerary",
      icon: Route,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      content: (
        <EditableItinerary
          itinerary={tripSections.itinerary}
          onSave={(content) => onSectionSave('itinerary', content)}
        />
      )
    },
    {
      id: "inclusions",
      title: "What's Included",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      content: (
        <EditableSection
          title="Inclusions"
          content={tripSections.inclusions}
          onSave={(content) => onSectionSave('inclusions', content)}
          type="list"
        />
      )
    },
    {
      id: "exclusions",
      title: "What's Not Included",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      content: (
        <EditableSection
          title="Exclusions"
          content={tripSections.exclusions}
          onSave={(content) => onSectionSave('exclusions', content)}
          type="list"
        />
      )
    },
    {
      id: "policy",
      title: "Policies & Terms",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      content: (
        <div className="space-y-6">
          <EditableSection
            title="Cancellation Policy"
            content={tripSections.cancellationPolicy}
            onSave={(content) => onSectionSave('cancellationPolicy', content)}
            type="textarea"
          />
          <div className="border-t pt-6">
            <EditableSection
              title="Refund Policy"
              content={tripSections.refundPolicy}
              onSave={(content) => onSectionSave('refundPolicy', content)}
              type="textarea"
            />
          </div>
        </div>
      )
    },
    {
      id: "essentials",
      title: "Trip Essentials",
      icon: Camera,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-amber-800 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Things to Remember
              </h4>
              <EditableSection
                title="Important Reminders"
                content={tripSections.thingsToRemember}
                onSave={(content) => onSectionSave('thingsToRemember', content)}
                type="list"
              />
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Things to Bring
              </h4>
              <EditableSection
                title="Essential Items"
                content={tripSections.thingsToBring}
                onSave={(content) => onSectionSave('thingsToBring', content)}
                type="list"
              />
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "transport",
      title: "Transportation",
      icon: Truck,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      content: (
        <EditableSection
          title="Transportation Details"
          content={tripSections.transportationClause}
          onSave={(content) => onSectionSave('transportationClause', content)}
          type="textarea"
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const Icon = section.icon;
        const isOpen = openSection === section.id;
        
        return (
          <Card key={section.id} className="overflow-hidden border-0 shadow-lg">
            <motion.div
              className={`p-6 cursor-pointer transition-colors ${
                isOpen ? section.bgColor : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setOpenSection(isOpen ? "" : section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 bg-white">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
};

export default ModernAccordion;
