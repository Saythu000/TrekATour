import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GripVertical, Eye, EyeOff, Save, Edit3 } from 'lucide-react';
import { Trip, tripService, RecommendationsContent, recommendationsContentService } from '@/lib/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/OptimizedImage';

export const RecommendationsManager = () => {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [recommendedTrips, setRecommendedTrips] = useState<Trip[]>([]);
  const [content, setContent] = useState<RecommendationsContent>({
    title: 'Recommended Adventures',
    description: 'Handpicked experiences that our adventurers love most. These trips offer the perfect blend of excitement, beauty, and unforgettable memories.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [all, recommended, sectionContent] = await Promise.all([
        tripService.getActive(),
        tripService.getRecommended(),
        recommendationsContentService.get()
      ]);
      setAllTrips(all);
      setRecommendedTrips(recommended);
      setContent(sectionContent);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRecommendation = async (trip: Trip) => {
    try {
      const isCurrentlyRecommended = recommendedTrips.some(r => r.id === trip.id);
      const newOrder = isCurrentlyRecommended ? undefined : recommendedTrips.length + 1;
      
      const { error } = await tripService.updateRecommendation(
        trip.id, 
        !isCurrentlyRecommended, 
        newOrder
      );

      if (error) throw error;

      // Update local state
      if (isCurrentlyRecommended) {
        setRecommendedTrips(prev => prev.filter(r => r.id !== trip.id));
      } else {
        const updatedTrip = { ...trip, is_recommended: true, recommendation_order: newOrder };
        setRecommendedTrips(prev => [...prev, updatedTrip]);
      }

      toast({
        title: "Success",
        description: `Trip ${isCurrentlyRecommended ? 'removed from' : 'added to'} recommendations`
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to update recommendation",
        variant: "destructive"
      });
    }
  };

  const saveContent = async () => {
    try {
      setSavingContent(true);
      const { error } = await recommendationsContentService.update({
        title: content.title,
        description: content.description
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section content updated successfully"
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save section content",
        variant: "destructive"
      });
    } finally {
      setSavingContent(false);
    }
  };

  const reorderRecommendations = (startIndex: number, endIndex: number) => {
    const result = Array.from(recommendedTrips);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setRecommendedTrips(result);
  };

  const saveOrder = async () => {
    try {
      setSaving(true);
      const tripIds = recommendedTrips.map(trip => trip.id);
      const { error } = await tripService.reorderRecommendations(tripIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recommendation order saved successfully"
      });
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: "Failed to save recommendation order",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Content Editor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-500" />
            <span>Section Content</span>
          </CardTitle>
          <Button onClick={saveContent} disabled={savingContent}>
            <Save className="w-4 h-4 mr-2" />
            {savingContent ? 'Saving...' : 'Save Content'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Recommended Adventures"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="section-description">Section Description</Label>
            <Textarea
              id="section-description"
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your recommendations section..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Preview:</h4>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {content.title.includes('Adventures') ? (
                <>
                  {content.title.replace(' Adventures', '')} <span className="text-orange-600">Adventures</span>
                </>
              ) : (
                <span className="text-orange-600">{content.title}</span>
              )}
            </h3>
            <p className="text-gray-600">{content.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Trips */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Recommended Trips ({recommendedTrips.length})</span>
          </CardTitle>
          {recommendedTrips.length > 0 && (
            <Button onClick={saveOrder} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Order'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recommendedTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recommended trips selected. Choose from available trips below.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendedTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  layout
                  className="flex items-center space-x-4 p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={trip.image_url || '/placeholder.svg'}
                      alt={trip.title}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{trip.title}</h4>
                    <p className="text-sm text-gray-600">
                      {trip.category} • ₹{trip.base_price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Order: {index + 1}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRecommendation(trip)}
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Available Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTrips
              .filter(trip => !recommendedTrips.some(r => r.id === trip.id))
              .map(trip => (
                <div
                  key={trip.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={trip.image_url || '/placeholder.svg'}
                      alt={trip.title}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{trip.title}</h4>
                    <p className="text-sm text-gray-600">
                      {trip.category} • {trip.duration} • ₹{trip.base_price.toLocaleString()}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRecommendation(trip)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Add to Recommendations
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
