import { AdminTrip } from "./adminStorage";

interface ItineraryDay {
  day: string;
  title: string;
  description: string;
  highlights: string[];
}

export const generateItinerary = (trip: AdminTrip): ItineraryDay[] => {
  // Extract number of days from duration string
  const getDaysFromDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*day/i);
    return match ? parseInt(match[1]) : 1;
  };

  const days = getDaysFromDuration(trip.duration);
  const category = trip.category.toLowerCase();
  const difficulty = trip.difficulty.toLowerCase();

  // Generate itinerary based on days and category
  const generateDayContent = (dayNum: number, totalDays: number): ItineraryDay => {
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === totalDays;
    const isMiddleDay = !isFirstDay && !isLastDay;

    if (totalDays === 1) {
      // Single day trip
      return {
        day: "Day 1",
        title: `${trip.title} - Full Day Experience`,
        description: `Complete ${trip.title.toLowerCase()} experience in a single day. Early morning start with all activities, meals, and return by evening.`,
        highlights: [
          "Early Morning Departure",
          "Main Activity/Adventure",
          "Lunch & Refreshments",
          "Photography Session",
          "Evening Return"
        ]
      };
    }

    if (isFirstDay) {
      // First day - Arrival & Setup
      return {
        day: `Day ${dayNum}`,
        title: "Arrival & Base Camp Setup",
        description: `Arrive at the base location for ${trip.title}. Meet the team, complete registration, gear check, and orientation session. Evening briefing and welcome dinner.`,
        highlights: [
          "Arrival & Registration",
          "Team Introduction",
          "Gear Check & Distribution",
          "Safety Briefing",
          "Welcome Dinner"
        ]
      };
    }

    if (isLastDay) {
      // Last day - Departure
      return {
        day: `Day ${dayNum}`,
        title: "Completion & Departure",
        description: `Final activities, pack up, group photos, and certificate distribution. Departure with memorable experiences and new friendships.`,
        highlights: [
          "Final Activities",
          "Pack Up & Check-out",
          "Group Photos",
          "Certificate Distribution",
          "Departure"
        ]
      };
    }

    // Middle days - Main activities
    if (category.includes('trek') || category.includes('himalayan')) {
      return {
        day: `Day ${dayNum}`,
        title: `Trekking Day ${dayNum - 1}`,
        description: `Continue the trekking adventure with scenic trails, challenging terrains, and breathtaking views. Packed lunch on the trail and overnight camping.`,
        highlights: [
          "Early Morning Start",
          "Scenic Trail Walking",
          "Packed Trail Lunch",
          "Photography Stops",
          "Evening Camp Setup"
        ]
      };
    }

    if (category.includes('adventure') || category.includes('water')) {
      return {
        day: `Day ${dayNum}`,
        title: `Adventure Activities Day ${dayNum - 1}`,
        description: `Full day of thrilling adventure activities including main attractions, safety briefings, and guided experiences with professional instructors.`,
        highlights: [
          "Morning Adventure Activities",
          "Safety Instructions",
          "Guided Experiences",
          "Lunch Break",
          "Evening Activities"
        ]
      };
    }

    if (category.includes('cultural') || category.includes('heritage')) {
      return {
        day: `Day ${dayNum}`,
        title: `Cultural Exploration Day ${dayNum - 1}`,
        description: `Explore local culture, visit heritage sites, interact with locals, and experience traditional activities. Authentic local meals included.`,
        highlights: [
          "Heritage Site Visits",
          "Local Interactions",
          "Traditional Activities",
          "Authentic Local Meals",
          "Cultural Performances"
        ]
      };
    }

    // Default middle day
    return {
      day: `Day ${dayNum}`,
      title: `Exploration Day ${dayNum - 1}`,
      description: `Continue the journey with exciting activities, sightseeing, and memorable experiences. Professional guidance throughout the day.`,
      highlights: [
        "Morning Activities",
        "Sightseeing Tours",
        "Local Experiences",
        "Meals Included",
        "Evening Relaxation"
      ]
    };
  };

  // Generate itinerary for all days
  const itinerary: ItineraryDay[] = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push(generateDayContent(i, days));
  }

  return itinerary;
};
