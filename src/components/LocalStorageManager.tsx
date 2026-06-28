import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LocalStorageManager = () => {
  const [localTrips, setLocalTrips] = useState<any[]>([]);
  const { toast } = useToast();

  const loadLocalTrips = () => {
    try {
      const stored = localStorage.getItem('adminTrips');
      if (stored) {
        const trips = JSON.parse(stored);
        setLocalTrips(trips);
      } else {
        setLocalTrips([]);
      }
    } catch (error) {
      console.error('Error loading local trips:', error);
      setLocalTrips([]);
    }
  };

  const deleteLocalTrip = (tripId: string, title: string) => {
    if (!confirm(`Delete "${title}" from local storage?`)) return;
    
    try {
      const stored = localStorage.getItem('adminTrips');
      if (stored) {
        const trips = JSON.parse(stored);
        const filtered = trips.filter((trip: any) => trip.id !== tripId);
        localStorage.setItem('adminTrips', JSON.stringify(filtered));
        
        toast({
          title: "Success",
          description: `Deleted "${title}" from local storage`,
        });
        
        loadLocalTrips();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip from local storage",
        variant: "destructive",
      });
    }
  };

  const clearAllLocalTrips = () => {
    if (!confirm('Clear ALL trips from local storage? This cannot be undone!')) return;
    
    try {
      localStorage.removeItem('adminTrips');
      localStorage.removeItem('trips'); // Also remove any other trip storage
      
      toast({
        title: "Success",
        description: "All local trips cleared",
      });
      
      loadLocalTrips();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear local storage",
        variant: "destructive",
      });
    }
  };

  const deleteSpecificDemoTrips = () => {
    try {
      // Remove from adminTrips
      const stored = localStorage.getItem('adminTrips');
      if (stored) {
        const trips = JSON.parse(stored);
        const filtered = trips.filter((trip: any) => 
          trip.id !== 'trip_2' && 
          trip.id !== 'trip_3' && 
          trip.id !== 'trip_24' &&
          trip.id !== '2' &&
          trip.id !== '3' &&
          trip.id !== '24' &&
          !trip.title.includes('Kayaking program') &&
          !trip.title.includes('3 Days Surf Course') &&
          !trip.title.includes('Jawhar one day trip')
        );
        
        localStorage.setItem('adminTrips', JSON.stringify(filtered));
      }
      
      // Remove from trips storage
      const tripsStored = localStorage.getItem('trips');
      if (tripsStored) {
        const trips = JSON.parse(tripsStored);
        const filtered = trips.filter((trip: any) => 
          trip.id !== 'trip_2' && 
          trip.id !== 'trip_3' && 
          trip.id !== 'trip_24' &&
          trip.id !== '2' &&
          trip.id !== '3' &&
          trip.id !== '24'
        );
        
        localStorage.setItem('trips', JSON.stringify(filtered));
      }
      
      // Remove individual cached trips
      localStorage.removeItem('trip_2');
      localStorage.removeItem('trip_3');
      localStorage.removeItem('trip_24');
      
      toast({
        title: "Success",
        description: "Demo trips (trip_2, trip_3, trip_24) removed from local storage",
      });
      
      loadLocalTrips();
      
      // Force page refresh to clear any cached data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove demo trips",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadLocalTrips();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Local Storage Trip Manager</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={loadLocalTrips} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={deleteSpecificDemoTrips} variant="destructive" size="sm">
            Remove Demo Trips
          </Button>
          <Button onClick={clearAllLocalTrips} variant="destructive" size="sm">
            Clear All Local Trips
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Found {localTrips.length} trips in local storage:</strong></p>
          {localTrips.map((trip) => (
            <div key={trip.id} className="flex justify-between items-center p-2 border rounded text-sm">
              <div>
                <strong>{trip.title}</strong>
                <span className="text-gray-500 ml-2">({trip.category})</span>
              </div>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteLocalTrip(trip.id, trip.title)}
              >
                Delete
              </Button>
            </div>
          ))}
          {localTrips.length === 0 && (
            <p className="text-gray-500">No trips in local storage</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalStorageManager;
