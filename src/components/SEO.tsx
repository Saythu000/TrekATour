import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title = "Trek A Tour - Adventure Travel & Trekking Experiences",
  description = "Discover breathtaking landscapes and conquer majestic peaks with India's most trusted adventure travel company. Book your next trekking adventure today!",
  keywords = "trekking, adventure travel, himalayan treks, weekend getaways, backpacking, india travel, outdoor adventures",
  image = "/lovable-uploads/3fc5d819-5b8c-4f31-83f6-aebb7a9d46ba.png",
  url = "https://trekatour.com",
  type = "website"
}: SEOProps) => {
  const fullTitle = title.includes("Trek A Tour") ? title : `${title} | Trek A Tour`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Trek A Tour" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Trek A Tour" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
    </Helmet>
  );
};

export default SEO;
