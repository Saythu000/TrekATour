const FEATURED_TRIPS_KEY = "featured_trips";

export interface FeaturedTrip {
  tripId: string;
  order: number;
  isActive: boolean;
}

// Get featured trips configuration
export const getFeaturedTrips = (): FeaturedTrip[] => {
  const stored = localStorage.getItem(FEATURED_TRIPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save featured trips configuration
export const saveFeaturedTrips = (featuredTrips: FeaturedTrip[]): void => {
  localStorage.setItem(FEATURED_TRIPS_KEY, JSON.stringify(featuredTrips));
};

// Add trip to featured list
export const addToFeatured = (tripId: string): void => {
  const featured = getFeaturedTrips();
  const exists = featured.find(f => f.tripId === tripId);
  
  if (!exists) {
    const newFeatured: FeaturedTrip = {
      tripId,
      order: featured.length,
      isActive: true
    };
    featured.push(newFeatured);
    saveFeaturedTrips(featured);
  }
};

// Remove trip from featured list
export const removeFromFeatured = (tripId: string): void => {
  const featured = getFeaturedTrips();
  const filtered = featured.filter(f => f.tripId !== tripId);
  saveFeaturedTrips(filtered);
};

// Toggle featured trip active status
export const toggleFeaturedStatus = (tripId: string): void => {
  const featured = getFeaturedTrips();
  const trip = featured.find(f => f.tripId === tripId);
  
  if (trip) {
    trip.isActive = !trip.isActive;
    saveFeaturedTrips(featured);
  }
};

// Reorder featured trips
export const reorderFeaturedTrips = (reorderedTrips: FeaturedTrip[]): void => {
  const updatedTrips = reorderedTrips.map((trip, index) => ({
    ...trip,
    order: index
  }));
  saveFeaturedTrips(updatedTrips);
};

// Clear all featured trips
export const clearAllFeaturedTrips = (): void => {
  localStorage.removeItem(FEATURED_TRIPS_KEY);
};
