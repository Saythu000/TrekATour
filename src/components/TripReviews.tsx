import { useState, useEffect } from 'react';
import { tripService } from '@/lib/dataService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  review_images?: string[] | string;
  youtube_link?: string;
  created_at: string;
}

interface TripReviewsProps {
  tripId: string;
}

export default function TripReviews({ tripId }: TripReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [tripId]);

  const fetchReviews = async () => {
    try {
      const data = await tripService.getReviews(tripId);
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-8">Customer Experiences</h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {review.review_images && (
                  <div className="md:w-1/3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {(typeof review.review_images === 'string' ? JSON.parse(review.review_images) : review.review_images).map((imgUrl: string, idx: number) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`Review ${idx + 1}`}
                          className="w-full h-48 min-w-[200px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open('https://www.instagram.com/trekatour/', '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">{review.user_name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(review.rating)}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 italic">"{review.review_text}"</p>
                  
                  {review.youtube_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(review.youtube_link, '_blank')}
                      className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Watch Video Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
