import { useEffect, useState } from 'react';
import { SitemapGenerator } from '@/lib/sitemap';

const Sitemap = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const xml = await SitemapGenerator.generateSitemap();
        setSitemapXML(xml);
        
        // Set proper content type for XML
        document.contentType = 'application/xml';
      } catch (error) {
        console.error('Error generating sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  if (loading) {
    return <div>Generating sitemap...</div>;
  }

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      fontSize: '12px', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: '20px'
    }}>
      {sitemapXML}
    </pre>
  );
};

export default Sitemap;
