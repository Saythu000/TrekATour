import { Helmet } from 'react-helmet-async';
import { Trip } from '@/lib/dataService';

interface TripSEOProps {
  trip: Trip;
  url?: string;
}

export const TripSEO = ({ trip, url }: TripSEOProps) => {
  const tripUrl = url || `https://trekatour.in/trip/${trip.slug || trip.id}`;
  const tripImage = trip.image_url || 'https://trekatour.in/tat-logo-official.png';
  
  const title = `${trip.title} | ${trip.duration} | ₹${trip.base_price?.toLocaleString()} - Trek A Tour`;
  const description = trip.short_desc || `Experience ${trip.title} with Trek A Tour. ${trip.duration} adventure starting from ₹${trip.base_price?.toLocaleString()}. Book your adventure today!`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${trip.title}, ${trip.category}, ${trip.difficulty}, adventure travel, trekking, Trek A Tour`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={tripImage} />
      <meta property="og:url" content={tripUrl} />
      <meta property="og:site_name" content="Trek A Tour" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@trekatour" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={tripImage} />
      
      {/* Additional SEO */}
      <meta name="author" content="Trek A Tour" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={tripUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": trip.title,
          "description": description,
          "image": tripImage,
          "url": tripUrl,
          "provider": {
            "@type": "Organization",
            "name": "Trek A Tour",
            "url": "https://trekatour.in"
          },
          "offers": {
            "@type": "Offer",
            "price": trip.base_price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "duration": trip.duration,
          "category": trip.category
        })}
      </script>
    </Helmet>
  );
};
