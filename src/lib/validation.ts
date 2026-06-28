import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000000;
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  } catch {
    return false;
  }
};

interface TripData {
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  difficulty?: string;
  maxGroupSize?: number;
}

export const validateTripData = (data: TripData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.length < 3) {
    errors.push("Title must be at least 3 characters");
  }
  
  if (!data.category || data.category.length < 2) {
    errors.push("Category is required");
  }
  
  if (!validatePrice(data.basePrice)) {
    errors.push("Price must be between 1 and 1,000,000");
  }
  
  if (data.image && !validateImageUrl(data.image)) {
    errors.push("Invalid image URL");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
