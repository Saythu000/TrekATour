import { useState } from 'react';
import { bookingService } from '@/lib/dataService';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  tripId?: string;
  packageName?: string;
  message?: string;
  number_of_people?: number;
  selected_date?: string;
}

export const useBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = async (data: BookingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        trip_id: data.tripId,
        package_name: data.packageName,
        message: data.message,
        number_of_people: data.number_of_people || 1,
        selected_date: data.selected_date,
        status: 'pending'
      };

      const { data: result, error: apiError } = await bookingService.create(bookingData);

      if (apiError) {
        throw new Error(typeof apiError === 'string' ? apiError : 'Booking failed');
      }

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBooking,
    isSubmitting,
    error
  };
};
