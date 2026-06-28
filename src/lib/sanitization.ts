/**
 * Input sanitization utilities
 * Provides additional security layer for user inputs
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/\0/g, ''); // Remove null bytes
};

/**
 * Sanitize email input
 */
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, ''); // Only allow word characters, @, ., and -
};

/**
 * Sanitize phone number input
 */
export const sanitizePhone = (phone: string): string => {
  return phone
    .trim()
    .replace(/[^\d+\s\-()]/g, ''); // Only allow digits, +, spaces, -, (, )
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (input: string | number): number => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : num;
};

/**
 * Escape HTML characters to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Remove SQL injection patterns (additional safety)
 */
export const sanitizeSqlPatterns = (input: string): string => {
  return input
    .replace(/('|(\\')|(;)|(\\)|(--)|(\s*(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+))/gi, '');
};

/**
 * Comprehensive input sanitization
 */
export const sanitizeInput = (input: string, type: 'string' | 'email' | 'phone' = 'string'): string => {
  let sanitized = sanitizeString(input);
  
  switch (type) {
    case 'email':
      sanitized = sanitizeEmail(sanitized);
      break;
    case 'phone':
      sanitized = sanitizePhone(sanitized);
      break;
    default:
      sanitized = sanitizeSqlPatterns(sanitized);
  }
  
  return sanitized;
};
