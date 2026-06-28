// API Client for Trek A Tour Backend
const API_URL = '/api-php';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Trips
  async getTrips() {
    return this.request('/trips');
  }

  async getAdminTrips() {
    return this.request('/admin/trips');
  }

  async getTripBySlug(slug) {
    return this.request(`/trips/${slug}`);
  }

  async getTripsByCategory(category) {
    return this.request(`/trips/category/${category}`);
  }

  async getRecommendedTrips() {
    return this.request(`/trips/recommended/all?t=${Date.now()}`);
  }

  // Content
  async getSiteContent(pageType, contentKey) {
    return this.request(`/content/${pageType}/${contentKey}?t=${Date.now()}`);
  }

  async getRecommendationsContent() {
    return this.request(`/recommendations-content?t=${Date.now()}`);
  }

  async setSiteContent(pageType, contentKey, contentValue) {
    return this.request('/admin/content', {
      method: 'POST',
      body: JSON.stringify({
        page_type: pageType,
        content_key: contentKey,
        content_value: contentValue
      }),
    });
  }

  async updateRecommendationsContent(title, description) {
    return this.request('/admin/recommendations-content', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  // Bookings
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Admin
  async createTrip(tripData) {
    return this.request('/admin/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(id, tripData) {
    return this.request(`/admin/trips/${id}`, {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(id) {
    return this.request(`/admin/trips/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTripRecommendation(id, isRecommended, order) {
    return this.request('/admin/trips/recommendation', {
      method: 'POST',
      body: JSON.stringify({ id, is_recommended: isRecommended, recommendation_order: order }),
    });
  }

  async reorderRecommendations(tripIds) {
    return this.request('/admin/trips/reorder-recommendations', {
      method: 'POST',
      body: JSON.stringify({ tripIds }),
    });
  }

  async updateFeaturedTrips(tripIds) {
    return this.request('/admin/trips/update-featured', {
      method: 'POST',
      body: JSON.stringify({ tripIds }),
    });
  }

  // Reviews
  async getTripReviews(tripId) {
    return this.request(`/reviews?tripId=${tripId}`);
  }

  async createReview(reviewData) {
    return this.request('/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Contact
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContactSubmissions() {
    return this.request('/admin/contact');
  }
}

export const apiClient = new ApiClient();
