// Utility functions for handling date expiry

export const isDateExpired = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Set the expiry time to 11:59 PM of the given date
    const expiryDate = new Date(date);
    expiryDate.setHours(23, 59, 59, 999);
    
    return now > expiryDate;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return true; // If date is invalid, consider it expired
  }
};

export const filterValidDates = (dates: string[]): string[] => {
  if (!dates || !Array.isArray(dates)) return [];
  
  return dates.filter(date => !isDateExpired(date));
};

export const hasValidDates = (dates: string[]): boolean => {
  const validDates = filterValidDates(dates);
  return validDates.length > 0;
};
