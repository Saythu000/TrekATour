import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminRoute from "@/components/AdminRoute";
import TripCreateFormHostinger from "@/components/admin/TripCreateFormHostinger";
import AdminAmazonReviewManager from "@/components/admin/AdminAmazonReviewManager";
import { RecommendationsManager } from "@/components/admin/RecommendationsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tripService, Trip } from "@/lib/dataService";
import { 
  Edit, 
  Trash2, 
  Search, 
  Plus,
  LogOut
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTripForReviews, setSelectedTripForReviews] = useState<Trip | null>(null);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrips();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCreatingTrip || editingTrip) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreatingTrip, editingTrip]);

  useEffect(() => {
    const filtered = trips.filter(trip =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrips(filtered);
  }, [trips, searchTerm]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAll();
      setTrips(data);
      console.log(`📊 Total trips in Hostinger: ${data.length}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trips from Hostinger",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    if (!confirm(`Are you sure you want to delete "${trip.title}"? This will permanently delete it from Hostinger!`)) return;
    
    try {
      const success = await tripService.delete(trip.id);
      if (success) {
        toast({
          title: "Success",
          description: `"${trip.title}" deleted from Hostinger`,
        });
        loadTrips(); // Reload from Hostinger
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip from Hostinger",
        variant: "destructive",
      });
    }
  };

  const handleTripCreated = () => {
    setIsCreatingTrip(false);
    loadTrips(); // Reload from Hostinger
    toast({
      title: "Success",
      description: "Trip created in Hostinger",
    });
  };

  const handleToggleVisibility = async (trip: Trip) => {
    try {
      const newStatus = !trip.is_active;
      
      const { error } = await tripService.update(trip.id, {
        is_active: newStatus
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Trip ${newStatus ? 'enabled' : 'disabled'} successfully`,
      });
      loadTrips(); // Refresh the trips list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trip visibility",
        variant: "destructive",
      });
    }
  };

  const handleClearAllTrips = async () => {
    if (!confirm('⚠️ This will DELETE ALL trips from Hostinger! Are you sure?')) return;
    
    try {
      const { error } = await tripService.clearAll();
      if (!error) {
        toast({
          title: "Success",
          description: "All trips cleared from Hostinger",
        });
        loadTrips(); // Reload empty list
      } else {
        throw new Error("Clear failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear all trips",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        // Clear admin status and email from localStorage
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        
        // Trigger custom event to update useAdmin hook
        window.dispatchEvent(new Event('adminStatusChanged'));
        
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully",
        });
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Error",
          description: "There was an issue logging out. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trips from Hostinger...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard (Hostinger)</h1>
              <p className="text-muted-foreground">Manage your trips in Hostinger database</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button 
                onClick={handleClearAllTrips}
                variant="destructive"
                size="sm"
              >
                🗑️ Clear All
              </Button>
              <Button onClick={() => setIsCreatingTrip(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Trip
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trips.length}</div>
                <p className="text-xs text-muted-foreground">In Hostinger database</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(trips.map(trip => trip.category)).size}
                </div>
                <p className="text-xs text-muted-foreground">Different categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hostinger</div>
                <p className="text-xs text-muted-foreground">Cloud database</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Main Content with Tabs */}
          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trips">Manage Trips</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="reviews">Manage Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trips" className="space-y-6">
              {/* Trips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden">
                {/* Trip Image */}
                {(() => {
                  const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
                  const imageUrl = localImage || trip.image_url;
                  
                  return imageUrl ? (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600" />
                  );
                })()}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{trip.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {trip.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {trip.duration && <p>⏱️ {trip.duration}</p>}
                    {trip.base_price && (
                      <div className="flex items-center gap-2">
                        {trip.original_price && trip.original_price > trip.base_price ? (
                          <>
                            <span className="line-through text-gray-400">₹{trip.original_price}</span>
                            <span className="font-semibold text-green-600">₹{trip.base_price}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              {Math.round(((trip.original_price - trip.base_price) / trip.original_price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span>💰 ₹{trip.base_price}</span>
                        )}
                      </div>
                    )}
                    {trip.short_desc && <p className="line-clamp-2">📝 {trip.short_desc}</p>}
                    {trip.available_dates && trip.available_dates.length > 0 && (
                      <p>📅 {trip.available_dates.length} dates available</p>
                    )}
                  </div>
                  
                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between mt-4 p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">
                      {trip.is_active ? "Visible to customers" : "Hidden from customers"}
                    </span>
                    <button
                      onClick={() => handleToggleVisibility(trip)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        trip.is_active ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          trip.is_active ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTrip(trip)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>

              {filteredTrips.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No trips found in Hostinger</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <RecommendationsManager />
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              {selectedTripForReviews ? (
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTripForReviews(null)}
                    className="mb-4"
                  >
                    ← Back to Trip Selection
                  </Button>
                  <AdminAmazonReviewManager 
                    tripId={selectedTripForReviews.id} 
                    tripTitle={selectedTripForReviews.title}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select a Trip to Manage Reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trips.map((trip) => (
                      <Card key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{trip.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{trip.location}</p>
                          <Button 
                            onClick={() => setSelectedTripForReviews(trip)}
                            className="w-full"
                            size="sm"
                          >
                            Manage Reviews
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Trip Create Modal */}
        {isCreatingTrip && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              // Close modal when clicking outside
              if (e.target === e.currentTarget) {
                setIsCreatingTrip(false);
              }
            }}
          >
            <TripCreateFormHostinger
              onClose={() => setIsCreatingTrip(false)}
              onTripCreated={handleTripCreated}
            />
          </div>
        )}

        {/* Trip Edit Modal */}
        {editingTrip && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              // Close modal when clicking outside
              if (e.target === e.currentTarget) {
                setEditingTrip(null);
              }
            }}
          >
            <TripCreateFormHostinger
              editTrip={editingTrip}
              onClose={() => setEditingTrip(null)}
              onTripCreated={() => {
                setEditingTrip(null);
                handleTripCreated();
              }}
            />
          </div>
        )}
      </div>
    </AdminRoute>
  );
};

export default Admin;
