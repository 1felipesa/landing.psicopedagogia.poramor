import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, ogImage, ogUrl }) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Psicopedagogia por Amor`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:type', 'website');
    if (ogImage) updateOGTag('og:image', ogImage);
    if (ogUrl) updateOGTag('og:url', ogUrl);

  }, [title, description, ogImage, ogUrl]);

  return null; // This component doesn't render anything
};

export default SEO;
