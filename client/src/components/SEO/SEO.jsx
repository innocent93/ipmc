import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords = '', 
  image = 'https://ipmc-ng.com/og-image.jpg',
  url = 'https://ipmc-ng.com',
  type = 'website',
  canonical,
}) {
  const siteName = 'IPMC Nigeria';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Leading project management, financial advisory, and ESG consultancy in Nigeria with 35+ years of excellence.';

  // Organization structured data: lets Google show a knowledge-panel style
  // result (logo, contact point, social links) instead of a plain blue link.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://ipmc-ng.com',
    logo: 'https://ipmc-ng.com/logo512.png',
    description: defaultDesc,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '18B Olu Holloway Road, Ikoyi',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-123-456-7890',
      contactType: 'customer service',
      email: 'enquiries@ipmc-ng.com',
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical || url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="IPMC Nigeria" />
      <meta name="geo.region" content="NG" />
      <meta name="geo.placename" content="Lagos, Nigeria" />

      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
