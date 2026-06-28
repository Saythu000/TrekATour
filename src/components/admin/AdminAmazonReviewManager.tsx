import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { tripService } from "@/lib/dataService";
import { Star, Trash2 } from "lucide-react";

interface AmazonReview {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  review_images?: string[];
  youtube_link?: string;
  created_at: string;
}

interface AdminAmazonReviewManagerProps {
  tripId: string;
  tripTitle: string;
}

export default function AdminAmazonReviewManager({ tripId, tripTitle }: AdminAmazonReviewManagerProps) {
  const [reviews, setReviews] = useState<AmazonReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    review_text: '',
    review_images: [] as File[],
    youtube_link: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [tripId]);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const imgFormData = new FormData();
      imgFormData.append('image', file);

      const response = await fetch('/api-php/upload.php', {
        method: 'POST',
        body: imgFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      uploadedUrls.push(result.url);
    }
    
    return uploadedUrls;
  };

  const fetchReviews = async () => {
    try {
      const data = await tripService.getReviews(tripId);
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_name.trim()) {
      toast({
        title: "Error",
        description: "User name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.review_text.trim()) {
      toast({
        title: "Error",
        description: "Review text is required", 
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUploading(true);
    try {
      let imageUrls: string[] = [];
      if (formData.review_images.length > 0) {
        imageUrls = await uploadImages(formData.review_images);
      }

      const { error } = await tripService.createReview({
        trip_id: tripId,
        user_name: formData.user_name,
        rating: formData.rating,
        review_text: formData.review_text,
        review_images: imageUrls.length > 0 ? imageUrls : null,
        youtube_link: formData.youtube_link || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review added successfully",
      });
      setFormData({
        user_name: '',
        rating: 5,
        review_text: '',
        review_images: [],
        youtube_link: ''
      });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await tripService.deleteReview(reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_name">Customer Name *</Label>
                <Input
                  id="user_name"
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  placeholder="Enter customer name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating *</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐☆ (4 stars)</option>
                  <option value={3}>⭐⭐⭐☆☆ (3 stars)</option>
                  <option value={2}>⭐⭐☆☆☆ (2 stars)</option>
                  <option value={1}>⭐☆☆☆☆ (1 star)</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="review_text">Review Text *</Label>
              <Textarea
                id="review_text"
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                placeholder="Enter detailed review..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="review_images">Upload Images</Label>
              <Input
                id="review_images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData({ ...formData, review_images: files });
                }}
              />
              {formData.review_images.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.review_images.length} image(s) selected
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="youtube_link">YouTube Link</Label>
              <Input
                id="youtube_link"
                value={formData.youtube_link}
                onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <Button type="submit" disabled={loading || uploading} className="w-full">
              {uploading ? 'Uploading Images...' : loading ? 'Adding Review...' : 'Add Review'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user_name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{review.review_text}</p>
                  
                  {review.review_images && review.review_images.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {(typeof review.review_images === 'string' ? JSON.parse(review.review_images) : review.review_images).map((imageUrl: string, index: number) => (
                        <img 
                          key={index}
                          src={imageUrl} 
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border cursor-pointer"
                          onClick={() => window.open('https://www.instagram.com/trekatour/', '_blank')}
                        />
                      ))}
                    </div>
                  )}
                  
                  {review.youtube_link && (
                    <div className="mb-2">
                      <a 
                        href={review.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        📺 Watch on YouTube
                      </a>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
