import React, { useEffect } from 'react';

const SITE_URL = 'https://autox.pk';
const DEFAULT_IMAGE = `${SITE_URL}/logo.svg`;
const SITE_NAME = 'AUTOX';
const BRAND_TAGLINE = 'ENGINEERED FOR YOUR DRIVE.';

/**
 * Helper to update or create a meta tag
 */
const setMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create a link tag (e.g. canonical)
 */
const setLinkTag = (rel, href) => {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  schema = null
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME} Pakistan`
    : `${SITE_NAME} Pakistan | Premium Car Accessories & Performance Upgrades`;

  const metaDesc = description ||
    'Discover premium automotive accessories at AUTOX Pakistan. High-performance aerodynamics, interior upgrades, LED lighting, and car care with PKR pricing and Cash on Delivery.';

  const fullCanonical = canonical
    ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`)
    : (noindex ? null : SITE_URL);

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Standard Meta
    setMetaTag('name', 'description', metaDesc);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', 'AUTOX Performance Lab');

    // 3. Canonical Link
    if (fullCanonical && !noindex) {
      setLinkTag('canonical', fullCanonical);
    } else {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical && noindex) {
        existingCanonical.remove();
      }
    }

    // 4. Open Graph Tags
    setMetaTag('property', 'og:site_name', `${SITE_NAME} — ${BRAND_TAGLINE}`);
    setMetaTag('property', 'og:locale', 'en_PK');
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:image', image);
    if (fullCanonical) {
      setMetaTag('property', 'og:url', fullCanonical);
    }

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', image);

    // 6. Schema.org JSON-LD Script Injection
    const existingScript = document.getElementById('autox-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'autox-jsonld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up injected schema script when unmounting
      const script = document.getElementById('autox-jsonld-schema');
      if (script) {
        script.remove();
      }
    };
  }, [fullTitle, metaDesc, fullCanonical, image, type, noindex, schema]);

  return null;
};

export default SEO;

