import { apiClient } from '@/lib/apiClient';
import { filterValidDates, hasValidDates } from '@/utils/dateUtils';

// Trip interface
export interface Trip {
  id: string;
  title: string;
  slug: string;
  category: string;
  region?: string;
  duration: string;
  base_price: number;
  original_price?: number;
  short_desc: string;
  image?: string;
  image_url?: string;
  difficulty?: string;
  highlights?: string[];
  features?: string[];
  itinerary?: any[];
  inclusions?: string[];
  exclusions?: string[];
  essentials?: string[];
  things_to_remember?: string[];
  is_active?: boolean;
  available_dates?: string[];
  is_recommended?: boolean;
  recommendation_order?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  meals?: string[];
  accommodation?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface RecommendationsContent {
  id?: string;
  title: string;
  description: string;
  updated_at?: string;
}

const filterTripsWithValidDates = (trips: Trip[]): Trip[] => {
  if (!trips || !Array.isArray(trips)) return [];
  return trips.map(trip => ({
    ...trip,
    available_dates: filterValidDates(trip.available_dates || [])
  })).filter(trip => {
    return !trip.available_dates || trip.available_dates.length === 0 || hasValidDates(trip.available_dates);
  });
};

export const tripService = {
  async getAll(): Promise<Trip[]> {
    try {
      const data = await apiClient.getAdminTrips();
      const filteredTrips = filterTripsWithValidDates(data || []);
      console.log(`📊 Admin: Loaded ${data?.length || 0} trips`);
      return data || []; // Don't filter out dates for admin view, show everything
    } catch (error) {
      console.error('Error fetching admin trips:', error);
      return [];
    }
  },

  async getActive(): Promise<Trip[]> {
    try {
      const data = await apiClient.getTrips();
      const filteredTrips = filterTripsWithValidDates(data || []);
      console.log(`🏠 Loaded ${data?.length || 0} trips, ${filteredTrips.length} with valid dates`);
      return filteredTrips;
    } catch (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
  },

  async getBySlugOrId(slugOrId: string): Promise<Trip | null> {
    try {
      const data = await apiClient.getTripBySlug(slugOrId);
      return data;
    } catch (error) {
      console.error('Error fetching trip by slug or ID:', error);
      return null;
    }
  },

  async getById(id: string): Promise<Trip | null> {
    return this.getBySlugOrId(id);
  },

  async getByCategory(category: string): Promise<Trip[]> {
    try {
      const data = await apiClient.getTripsByCategory(category);
      const filteredTrips = filterTripsWithValidDates(data || []);
      console.log(`🎯 Loaded ${data?.length || 0} trips for category: ${category}, ${filteredTrips.length} with valid dates`);
      return filteredTrips;
    } catch (error) {
      console.error('Error fetching trips by category:', error);
      return [];
    }
  },

  async create(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Trip | null; error: any }> {
    try {
      const data = await apiClient.createTrip(trip);
      console.log('✅ Trip created:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating trip:', error);
      return { data: null, error };
    }
  },

  async update(id: string, updates: Partial<Trip>): Promise<{ data: Trip | null; error: any }> {
    try {
      const data = await apiClient.updateTrip(id, updates);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating trip:', error);
      return { data: null, error };
    }
  },

  async delete(id: string): Promise<{ error: any }> {
    try {
      await apiClient.deleteTrip(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting trip:', error);
      return { error };
    }
  },

  async getRecommended(): Promise<Trip[]> {
    try {
      const data = await apiClient.getRecommendedTrips();
      const filteredTrips = filterTripsWithValidDates(data || []);
      return filteredTrips;
    } catch (error) {
      console.error('Error fetching recommended trips:', error);
      return [];
    }
  },

  async updateRecommendation(id: string, isRecommended: boolean, order?: number): Promise<{ error: any }> {
    try {
      await apiClient.updateTripRecommendation(id, isRecommended, order);
      return { error: null };
    } catch (error) {
      console.error('Error updating trip recommendation:', error);
      return { error };
    }
  },

  async reorderRecommendations(tripIds: string[]): Promise<{ error: any }> {
    try {
      await apiClient.reorderRecommendations(tripIds);
      return { error: null };
    } catch (error) {
      console.error('Error reordering recommendations:', error);
      return { error };
    }
  },

  async updateFeaturedTrips(tripIds: string[]): Promise<{ error: any }> {
    try {
      await apiClient.updateFeaturedTrips(tripIds);
      return { error: null };
    } catch (error) {
      console.error('Error updating featured trips:', error);
      return { error };
    }
  },

  async clearAll(): Promise<{ error: any }> {
    console.warn('clearAll not implemented for API');
    return { error: 'Not implemented' };
  },

  async cleanupExpiredDates(): Promise<void> {
    console.log('🧹 Cleanup handled by backend');
  },

  async getReviews(tripId: string): Promise<any[]> {
    try {
      return await apiClient.getTripReviews(tripId);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  async createReview(review: any): Promise<{ data: any; error: any }> {
    try {
      const data = await apiClient.createReview(review);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
  },

  async deleteReview(reviewId: string): Promise<{ error: any }> {
    try {
      await apiClient.deleteReview(reviewId);
      return { error: null };
    } catch (error) {
      console.error('Error deleting review:', error);
      return { error };
    }
  }
};

export const recommendationsContentService = {
  async get(): Promise<RecommendationsContent> {
    try {
      const data = await apiClient.getRecommendationsContent();
      return data || {
        title: 'Recommended Adventures',
        description: 'Handpicked experiences that our adventurers love most.'
      };
    } catch (error) {
      console.error('Error fetching recommendations content:', error);
      return {
        title: 'Recommended Adventures',
        description: 'Handpicked experiences that our adventurers love most.'
      };
    }
  },

  async update(content: Omit<RecommendationsContent, 'id' | 'updated_at'>): Promise<{ error: any }> {
    try {
      await apiClient.updateRecommendationsContent(content.title, content.description);
      return { error: null };
    } catch (error) {
      console.error('Error updating recommendations content:', error);
      return { error };
    }
  }
};

export const bookingService = {
  async create(booking: any): Promise<{ data: any; error: any }> {
    try {
      const data = await apiClient.createBooking(booking);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { data: null, error };
    }
  }
};
