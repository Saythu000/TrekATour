import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { useDateCleanup } from "@/hooks/useDateCleanup";

// Import button visibility fixes
import "@/utils/buttonVisibilityFix";

import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingChatbot from "./components/FloatingChatbot";
import { PageLoader } from "./components/LoadingSpinner";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const CategoryTrips = lazy(() => import("./pages/CategoryTrips"));
const TripDetails = lazy(() => import("./pages/TripDetails"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Booking = lazy(() => import("./pages/Booking"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Robots = lazy(() => import("./pages/Robots"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Initialize automatic date cleanup
  useDateCleanup();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                  <ErrorBoundary>
                    <Navbar />
                  </ErrorBoundary>
                  <main className="flex-1 pt-20 md:pt-24">
                    <ErrorBoundary>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                        <Route path="/" element={<Index />} />
                        
                        {/* Unified Category Routes */}
                        <Route path="/himachaltrips" element={<CategoryTrips />} />
                        <Route path="/weekends" element={<CategoryTrips />} />
                        <Route path="/backpacking" element={<CategoryTrips />} />
                        <Route path="/camping" element={<CategoryTrips />} />
                        <Route path="/adventure" element={<CategoryTrips />} />
                        <Route path="/cultural" element={<CategoryTrips />} />
                        <Route path="/pilgrimage" element={<CategoryTrips />} />
                        <Route path="/international" element={<CategoryTrips />} />
                        
                        <Route path="/trip/:tripId" element={<TripDetails />} />
                        <Route path="/booking/:tripId" element={<BookingPage />} />
                        <Route path="/wildlife" element={<Navigate to="/upcoming" replace />} />

                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />

                        <Route path="/booking" element={<Booking />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin" element={<Admin />} />
                        
                        {/* SEO Routes */}
                        <Route path="/sitemap.xml" element={<Sitemap />} />
                        <Route path="/robots.txt" element={<Robots />} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                  <ErrorBoundary>
                    <Footer />
                  </ErrorBoundary>
                </div>
                <FloatingChatbot />
              </HashRouter>
            </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
