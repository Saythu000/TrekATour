import { Trip } from "@/data/trips";

const ADMIN_TRIPS_KEY = "admin_trips";
const TRIP_SCHEDULES_KEY = "trip_schedules";

export interface AdminTrip extends Trip {
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripSchedule {
  tripId: string;
  availableDates: string[]; // ISO date strings
  updated_at: string;
}

// Get all trips from localStorage
export const getAdminTrips = (): AdminTrip[] => {
  const stored = localStorage.getItem(ADMIN_TRIPS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save trips to localStorage
export const saveAdminTrips = (trips: AdminTrip[]): void => {
  localStorage.setItem(ADMIN_TRIPS_KEY, JSON.stringify(trips));
};

// Get trip schedules
export const getTripSchedules = (): TripSchedule[] => {
  const stored = localStorage.getItem(TRIP_SCHEDULES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save trip schedules
export const saveTripSchedules = (schedules: TripSchedule[]): void => {
  localStorage.setItem(TRIP_SCHEDULES_KEY, JSON.stringify(schedules));
};

// Get schedule for specific trip
export const getTripSchedule = (tripId: string): TripSchedule | null => {
  const schedules = getTripSchedules();
  return schedules.find(s => s.tripId === tripId) || null;
};

// Update trip schedule
export const updateTripSchedule = (tripId: string, dates: Date[]): void => {
  const schedules = getTripSchedules();
  const dateStrings = dates.map(date => date.toISOString().split('T')[0]);
  
  const existingIndex = schedules.findIndex(s => s.tripId === tripId);
  const schedule: TripSchedule = {
    tripId,
    availableDates: dateStrings,
    updated_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    schedules[existingIndex] = schedule;
  } else {
    schedules.push(schedule);
  }

  saveTripSchedules(schedules);
};

// Get available dates for a trip
export const getTripAvailableDates = (tripId: string): Date[] => {
  const schedule = getTripSchedule(tripId);
  if (!schedule) return [];
  
  return schedule.availableDates.map(dateStr => new Date(dateStr));
};

// Add new trip
export const addTrip = (tripData: Omit<AdminTrip, "id" | "created_at" | "updated_at">): AdminTrip => {
  const trips = getAdminTrips();
  const newTrip: AdminTrip = {
    ...tripData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  trips.push(newTrip);
  saveAdminTrips(trips);
  return newTrip;
};

// Update trip
export const updateTrip = (id: string, updates: Partial<AdminTrip>): AdminTrip | null => {
  const trips = getAdminTrips();
  const index = trips.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  trips[index] = {
    ...trips[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveAdminTrips(trips);
  return trips[index];
};

// Toggle trip status
export const toggleTripStatus = (id: string): AdminTrip | null => {
  const trips = getAdminTrips();
  const trip = trips.find(t => t.id === id);
  if (!trip) return null;
  
  return updateTrip(id, { is_active: !trip.is_active });
};

// Delete trip
export const deleteTrip = (id: string): boolean => {
  const trips = getAdminTrips();
  const filtered = trips.filter(t => t.id !== id);
  if (filtered.length === trips.length) return false;
  
  saveAdminTrips(filtered);
  
  // Also remove schedule
  const schedules = getTripSchedules();
  const filteredSchedules = schedules.filter(s => s.tripId !== id);
  saveTripSchedules(filteredSchedules);
  
  return true;
};

// Create new trip
export const createTrip = (tripData: Omit<AdminTrip, 'id' | 'created_at' | 'updated_at'>): AdminTrip => {
  const trips = getAdminTrips();
  const newTrip: AdminTrip = {
    ...tripData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  trips.push(newTrip);
  saveAdminTrips(trips);
  return newTrip;
};

// Get active trips only (for public display)
export const getActiveTrips = (): AdminTrip[] => {
  return getAdminTrips().filter(trip => trip.is_active);
};
