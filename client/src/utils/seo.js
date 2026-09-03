export const generateMeta = ({
  title,
  description,
  keywords = '',
  image = '',
  url = '',
  type = 'website',
}) => {
  const siteName = 'IPMC Nigeria';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return {
    title: fullTitle,
    meta: [
      { name: 'description', content: description || 'Leading project management and ESG consultancy in Nigeria.' },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  };
};
