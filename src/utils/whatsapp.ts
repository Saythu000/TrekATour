import { Trip } from "@/data/trips";

export const generateWhatsAppBookingUrl = (trip: Trip): string => {
  const message = `Hi! I'm interested in booking ${trip.title} (₹${trip.basePrice.toLocaleString()} - ${trip.duration}). Please share more details and availability.`;
  const encodedMessage = encodeURIComponent(message);
  
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return isMobile 
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?text=${encodedMessage}`;
};

export const handleWhatsAppBooking = (trip: Trip, onFallback?: () => void) => {
  const whatsappUrl = generateWhatsAppBookingUrl(trip);
  
  // Track analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'whatsapp_click', {
      package_id: trip.id,
      package_name: trip.title,
      package_price: trip.basePrice
    });
  }
  
  try {
    const opened = window.open(whatsappUrl, '_blank');
    
    // Check if WhatsApp failed to open (mainly for desktop)
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      throw new Error('WhatsApp failed to open');
    }
  } catch (error) {
    console.warn('WhatsApp booking failed:', error);
    if (onFallback) {
      onFallback();
    }
  }
};