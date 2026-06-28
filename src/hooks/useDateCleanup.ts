import { useEffect } from 'react';
import { tripService } from '@/lib/dataService';

export const useDateCleanup = () => {
  useEffect(() => {
    // Run cleanup on component mount
    const runCleanup = async () => {
      await tripService.cleanupExpiredDates();
    };

    // Run immediately
    runCleanup();

    // Set up interval to run cleanup every hour
    const interval = setInterval(runCleanup, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);
};
