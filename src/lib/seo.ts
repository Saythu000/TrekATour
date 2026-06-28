export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  price?: number;
  rating?: number;
  duration?: string;
}

export class SEOUtils {
  private static readonly SITE_NAME = "Trek A Tour";
  private static readonly SITE_URL = "https://trekatour.com";
  private static readonly DEFAULT_IMAGE = "/images/default-trek.jpg";

  static generateTitle(pageTitle: string, includeCompany = true): string {
    if (!includeCompany) return pageTitle;
    return `${pageTitle} | ${this.SITE_NAME}`;
  }

  static generateDescription(content: string, maxLength = 160): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3).trim() + "...";
  }

  static generateKeywords(baseKeywords: string[], additionalKeywords: string[] = []): string {
    const defaultKeywords = [
      "adventure travel", "trekking", "hiking", "mountain climbing", 
      "outdoor adventure", "travel packages", "india travel", "himalayan trek"
    ];
    return [...baseKeywords, ...additionalKeywords, ...defaultKeywords].join(", ");
  }

  static generateTripTitle(tripName: string, duration?: string, location?: string): string {
    let title = tripName;
    if (duration) title += ` - ${duration}`;
    if (location) title += ` in ${location}`;
    title += " Adventure";
    return this.generateTitle(title);
  }

  static generateTripDescription(trip: any): string {
    const { title, duration, base_price, difficulty, short_desc } = trip;
    
    let description = `Experience the ${title}`;
    if (duration) description += ` - ${duration} adventure`;
    if (short_desc) description += `. ${short_desc}`;
    if (base_price) description += ` Starting from ₹${base_price.toLocaleString()}`;
    if (difficulty) description += `. ${difficulty} difficulty level`;
    description += ". Book now with professional guides and safety equipment.";
    
    return this.generateDescription(description);
  }

  static generateStructuredData(type: 'Organization' | 'Product' | 'BreadcrumbList', data: any) {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": this.SITE_NAME,
          "url": this.SITE_URL,
          "logo": `${this.SITE_URL}/logo.png`,
          "description": "Trekking Adventure Touring company specializing in trekking and outdoor adventures across India",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://facebook.com/trekatour",
            "https://instagram.com/trekatour",
            "https://twitter.com/trekatour"
          ]
        };

      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.title,
          "description": data.short_desc || data.description,
          "image": data.image_url || this.DEFAULT_IMAGE,
          "brand": {
            "@type": "Brand",
            "name": this.SITE_NAME
          },
          "offers": {
            "@type": "Offer",
            "price": data.base_price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString()
          },
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.reviewCount || 1
          } : undefined,
          "category": "Adventure Travel Package"
        };

      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${this.SITE_URL}${item.url}`
          }))
        };

      default:
        return null;
    }
  }

  static generateCanonicalUrl(path: string): string {
    return `${this.SITE_URL}${path}`;
  }
}
