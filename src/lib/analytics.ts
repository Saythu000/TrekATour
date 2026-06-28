// Simple analytics utility - can be extended with Google Analytics, Mixpanel, etc.

interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  track(event: string, category: string, label?: string, value?: number) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for now (can be sent to analytics service)
    const stored = localStorage.getItem('analytics_events') || '[]';
    const events = JSON.parse(stored);
    events.push({
      ...analyticsEvent,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics:', analyticsEvent);
    }
  }

  // Common tracking methods
  trackPageView(page: string) {
    this.track('page_view', 'navigation', page);
  }

  trackTripView(tripId: string, tripTitle: string) {
    this.track('trip_view', 'trips', `${tripId}-${tripTitle}`);
  }

  trackBookingAttempt(tripId: string, method: string) {
    this.track('booking_attempt', 'bookings', `${tripId}-${method}`);
  }

  trackSearch(query: string) {
    this.track('search', 'user_interaction', query);
  }

  trackImageUpload(success: boolean) {
    this.track('image_upload', 'admin', success ? 'success' : 'failure');
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const analytics = new Analytics();
