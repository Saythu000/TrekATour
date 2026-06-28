import { AdminTrip } from "./adminStorage";

export interface ItineraryDay {
  day: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface TripSections {
  tripId: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  transportationClause: string;
  cancellationPolicy: string;
  refundPolicy: string;
  thingsToBring: string[];
  thingsToRemember: string[];
  updated_at: string;
}

const TRIP_SECTIONS_KEY = "trip_sections";

// Get sections for a specific trip
export const getTripSections = (tripId: string): TripSections => {
  const stored = localStorage.getItem(TRIP_SECTIONS_KEY);
  const allSections: TripSections[] = stored ? JSON.parse(stored) : [];
  
  const existing = allSections.find(s => s.tripId === tripId);
  if (existing) return existing;
  
  // Return default sections
  return {
    tripId,
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival & Setup",
        description: "Arrive at base location, meet team, and complete orientation.",
        highlights: ["Team Introduction", "Gear Check", "Safety Briefing"]
      }
    ],
    inclusions: [
      "Professional Guide",
      "All Meals",
      "Accommodation",
      "Transportation",
      "Safety Equipment",
      "Permits & Fees"
    ],
    exclusions: [
      "Transportation to Base Camp",
      "Personal Trekking Gear",
      "Travel Insurance",
      "Personal Expenses",
      "Tips for Guide/Porter",
      "Emergency Evacuation"
    ],
    transportationClause: "Transportation arrangements are the responsibility of participants unless specifically mentioned in inclusions. We can assist with booking recommendations upon request.",
    cancellationPolicy: "Cancellations made 15+ days before trip: 80% refund. 7-14 days before: 50% refund. Less than 7 days: No refund.",
    refundPolicy: "Refunds will be processed within 7-10 business days to the original payment method. Processing fees may apply as per payment gateway terms.",
    thingsToBring: [
      "Comfortable trekking shoes",
      "Weather-appropriate clothing",
      "Personal water bottle",
      "Sunscreen and sunglasses",
      "Personal medications",
      "Valid ID proof"
    ],
    thingsToRemember: [
      "Arrive 30 minutes before departure",
      "Follow guide instructions at all times",
      "Respect local culture and environment",
      "Stay hydrated throughout the trip",
      "Inform about medical conditions",
      "Keep emergency contacts handy"
    ],
    updated_at: new Date().toISOString()
  };
};

// Save sections for a trip
export const saveTripSections = (sections: TripSections): void => {
  const stored = localStorage.getItem(TRIP_SECTIONS_KEY);
  const allSections: TripSections[] = stored ? JSON.parse(stored) : [];
  
  const index = allSections.findIndex(s => s.tripId === sections.tripId);
  const updatedSections = { ...sections, updated_at: new Date().toISOString() };
  
  if (index >= 0) {
    allSections[index] = updatedSections;
  } else {
    allSections.push(updatedSections);
  }
  
  localStorage.setItem(TRIP_SECTIONS_KEY, JSON.stringify(allSections));
};
