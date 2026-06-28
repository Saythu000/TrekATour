import { tripService } from './dataService';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private static readonly BASE_URL = 'https://trekatour.com';

  static async generateSitemap(): Promise<string> {
    const urls: SitemapUrl[] = [];

    // Static pages
    urls.push(
      {
        loc: this.BASE_URL,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: `${this.BASE_URL}/about`,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.BASE_URL}/contact`,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: `${this.BASE_URL}/trips`,
        changefreq: 'daily',
        priority: 0.9
      }
    );

    // Trip categories
    const categories = ['Trekking', 'Adventure', 'Camping', 'Hiking', 'Mountaineering'];
    categories.forEach(category => {
      urls.push({
        loc: `${this.BASE_URL}/category/${category.toLowerCase()}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Dynamic trip pages
    try {
      const trips = await tripService.getAll();
      if (trips.data) {
        trips.data.forEach(trip => {
          urls.push({
            loc: `${this.BASE_URL}/trip/${trip.slug}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: trip.updated_at ? new Date(trip.updated_at).toISOString().split('T')[0] : undefined
          });
        });
      }
    } catch (error) {
      console.error('Error fetching trips for sitemap:', error);
    }

    return this.generateXML(urls);
  }

  private static generateXML(urls: SitemapUrl[]): string {
    const urlElements = urls.map(url => {
      let urlXML = `    <url>\n      <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        urlXML += `      <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlXML += `      <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlXML += `      <priority>${url.priority}</priority>\n`;
      }
      
      urlXML += `    </url>`;
      return urlXML;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  static generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin
Disallow: /admin-login
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemap
Sitemap: ${this.BASE_URL}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
  }
}
