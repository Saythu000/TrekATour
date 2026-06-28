import { Helmet } from 'react-helmet-async';
import { SEOData, SEOUtils } from '@/lib/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
  noIndex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  image = '/images/default-trek.jpg',
  url,
  type = 'website',
  structuredData,
  noIndex = false
}: SEOHeadProps) => {
  const fullTitle = SEOUtils.generateTitle(title);
  const canonicalUrl = url ? SEOUtils.generateCanonicalUrl(url) : undefined;
  const fullImageUrl = image.startsWith('http') ? image : `https://trekatour.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Trek A Tour" />
      {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {fullImageUrl && <meta name="twitter:image" content={fullImageUrl} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Specialized components for different page types
export const TripSEO = ({ trip, url }: { trip: any; url: string }) => {
  const title = SEOUtils.generateTripTitle(trip.title, trip.duration, trip.location);
  const description = SEOUtils.generateTripDescription(trip);
  const keywords = SEOUtils.generateKeywords(
    [trip.title, trip.category, trip.location || ''].filter(Boolean),
    trip.difficulty ? [trip.difficulty] : []
  );
  
  const structuredData = SEOUtils.generateStructuredData('Product', trip);

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={trip.image_url}
      url={url}
      type="product"
      structuredData={structuredData}
    />
  );
};

export const CategorySEO = ({ category, url }: { category: string; url: string }) => {
  const title = `${category} Adventures & Treks`;
  const description = `Discover amazing ${category.toLowerCase()} adventures and treks. Professional guides, safety equipment, and unforgettable experiences. Book your ${category.toLowerCase()} adventure today!`;
  const keywords = SEOUtils.generateKeywords([category, `${category} trek`, `${category} adventure`]);

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      url={url}
      type="website"
    />
  );
};

export const HomeSEO = () => {
  const title = "Adventure Travel & Trekking Packages";
  const description = "Discover incredible adventure travel packages and trekking experiences across India. Professional guides, safety equipment, and unforgettable memories. Book your adventure today!";
  const keywords = SEOUtils.generateKeywords(['adventure travel', 'trekking packages', 'hiking tours']);
  
  const structuredData = SEOUtils.generateStructuredData('Organization', {});

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      url="/"
      type="website"
      structuredData={structuredData}
    />
  );
};
