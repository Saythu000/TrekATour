/**
 * Custom hook for form validation using Zod schemas
 * Provides reusable validation logic with error handling
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useToast } from './use-toast';

interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: Record<string, string>;
}

interface UseFormValidationReturn<T> {
  validate: (data: unknown) => ValidationResult<T>;
  validateField: (fieldName: string, value: unknown) => string | null;
  errors: Record<string, string>;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
}

export function useFormValidation<T>(schema: z.ZodSchema<T>): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = useCallback((data: unknown): ValidationResult<T> => {
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      return {
        isValid: true,
        data: validatedData,
        errors: {}
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.');
          fieldErrors[fieldName] = err.message;
        });

        setErrors(fieldErrors);
        
        // Show toast with first error
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive'
        });

        return {
          isValid: false,
          errors: fieldErrors
        };
      }
      
      // Handle unexpected errors
      const unexpectedError = 'An unexpected validation error occurred';
      setErrors({ general: unexpectedError });
      toast({
        title: 'Validation Error',
        description: unexpectedError,
        variant: 'destructive'
      });

      return {
        isValid: false,
        errors: { general: unexpectedError }
      };
    }
  }, [schema, toast]);

  const validateField = useCallback((fieldName: string, value: unknown): string | null => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = schema.pick({ [fieldName]: true } as Record<string, true>);
      fieldSchema.parse({ [fieldName]: value });
      
      // Clear error for this field if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || 'Invalid value';
        
        setErrors(prev => ({
          ...prev,
          [fieldName]: fieldError
        }));
        
        return fieldError;
      }
      return 'Validation error';
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    validate,
    validateField,
    errors,
    clearErrors,
    clearFieldError
  };
}
