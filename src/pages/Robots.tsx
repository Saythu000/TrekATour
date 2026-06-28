import { useEffect, useState } from 'react';
import { SitemapGenerator } from '@/lib/sitemap';

const Robots = () => {
  const [robotsTxt, setRobotsTxt] = useState<string>('');

  useEffect(() => {
    const txt = SitemapGenerator.generateRobotsTxt();
    setRobotsTxt(txt);
  }, []);

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      fontSize: '12px', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: '20px'
    }}>
      {robotsTxt}
    </pre>
  );
};

export default Robots;
