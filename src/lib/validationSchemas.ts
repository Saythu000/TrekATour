/**
 * Comprehensive validation schemas using Zod
 * Provides type-safe validation for all forms and user inputs
 */

import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must not exceed 100 characters')
  .toLowerCase()
  .trim();

const phoneSchema = z.string()
  .regex(/^[+]?[\d\s\-()]{10,15}$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .trim();

const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .trim();

// Booking form validation
export const bookingFormSchema = z.object({
  traveller_mode: z.enum(['Solo', 'Couple', 'Family', 'Group'], {
    required_error: 'Please select a travel mode',
    invalid_type_error: 'Invalid travel mode selected'
  }),
  stay_type: z.enum(['Quad Sharing', 'Triple Sharing', 'Twin Sharing', 'Single Sharing'], {
    required_error: 'Please select a stay type',
    invalid_type_error: 'Invalid stay type selected'
  }),
  adults: z.number()
    .int('Number of adults must be a whole number')
    .min(1, 'At least 1 adult is required')
    .max(20, 'Maximum 20 adults allowed'),
  email: emailSchema,
  phone: phoneSchema,
  specialRequests: z.string()
    .max(500, 'Special requests must not exceed 500 characters')
    .optional()
    .transform(val => val?.trim())
});

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .trim(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim()
});

// Trip creation/edit validation (Admin)
export const tripFormSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  basePrice: z.number()
    .positive('Price must be greater than 0')
    .max(1000000, 'Price must not exceed ₹10,00,000'),
  duration: z.string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must not exceed 50 characters')
    .trim(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging', 'Difficult'], {
    required_error: 'Please select difficulty level'
  }),
  category: z.string()
    .min(3, 'Category must be at least 3 characters')
    .max(50, 'Category must not exceed 50 characters')
    .trim(),
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must not exceed 100 characters')
    .trim(),
  maxGroupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Minimum group size is 1')
    .max(100, 'Maximum group size is 100'),
  inclusions: z.array(z.string().trim()).optional(),
  exclusions: z.array(z.string().trim()).optional(),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string().min(5).max(100).trim(),
    description: z.string().min(10).max(500).trim()
  })).optional()
});

// User profile validation
export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  dateOfBirth: z.date().optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().min(2).max(30).trim()
  }).optional()
});

// Search/filter validation
export const searchFilterSchema = z.object({
  query: z.string()
    .max(100, 'Search query must not exceed 100 characters')
    .trim()
    .optional(),
  category: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging', 'Difficult']).optional(),
  duration: z.string().optional()
}).refine(data => {
  if (data.priceMin && data.priceMax) {
    return data.priceMin <= data.priceMax;
  }
  return true;
}, {
  message: 'Minimum price must be less than or equal to maximum price',
  path: ['priceMin']
});

// Type exports for TypeScript
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type TripFormData = z.infer<typeof tripFormSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type SearchFilterData = z.infer<typeof searchFilterSchema>;
