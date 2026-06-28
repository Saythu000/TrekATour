// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  // Mark the end and measure performance
  measure(name: string): number {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      const duration = measure?.duration || 0;
      
      this.metrics.set(name, duration);
      return duration;
    }
    return 0;
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Log performance metrics to console (development only)
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      this.metrics.forEach((duration, name) => {
        const color = duration < 100 ? 'green' : duration < 500 ? 'orange' : 'red';
        console.log(`%c${name}: ${duration.toFixed(2)}ms`, `color: ${color}`);
      });
      console.groupEnd();
    }
  }

  // Get Web Vitals
  static getWebVitals(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({});
        return;
      }

      // Core Web Vitals
      const vitals: any = {};

      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        vitals.FCP = fcpEntry.startTime;
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.LCP = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Observer not supported
        }
      }

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        vitals.TTFB = navigation.responseStart - navigation.requestStart;
        vitals.DOMContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
        vitals.LoadComplete = navigation.loadEventEnd - navigation.navigationStart;
      }

      setTimeout(() => resolve(vitals), 1000);
    });
  }

  // Report performance to analytics (placeholder)
  static reportToAnalytics(metrics: Record<string, number>): void {
    if (process.env.NODE_ENV === 'production') {
      // In production, you would send this to your analytics service
      // Example: Google Analytics, Mixpanel, etc.
      console.log('Performance metrics:', metrics);
    }
  }
}

// Hook for React components
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const startMeasure = (name: string) => monitor.mark(name);
  const endMeasure = (name: string) => monitor.measure(name);
  const getMetrics = () => monitor.getMetrics();
  const logMetrics = () => monitor.logMetrics();

  return { startMeasure, endMeasure, getMetrics, logMetrics };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);

  // Preload hero image
  const heroImageLink = document.createElement('link');
  heroImageLink.rel = 'preload';
  heroImageLink.href = '/hero-image.webp';
  heroImageLink.as = 'image';
  document.head.appendChild(heroImageLink);
};

// Lazy load non-critical resources
export const lazyLoadResources = () => {
  if (typeof window === 'undefined') return;

  // Lazy load analytics
  setTimeout(() => {
    // Load analytics scripts here
  }, 2000);

  // Lazy load chat widgets or other non-critical scripts
  setTimeout(() => {
    // Load chat widgets here
  }, 3000);
};
