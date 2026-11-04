/**
 * AUTOX Schema.org JSON-LD Generator
 * Factually grounded in real MongoDB records, authoritative PKR currency, and Pakistani market data.
 */

const BASE_URL = 'https://autox.pk';

export const schemaGenerator = {
  getSiteUrl: () => BASE_URL,

  /**
   * Root Organization Schema
   */
  generateOrganizationSchema: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AUTOX',
    legalName: 'AUTOX Automotive E-Commerce Pakistan',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    slogan: 'ENGINEERED FOR YOUR DRIVE.',
    description: 'Pakistan’s premier high-performance automotive accessories e-commerce platform with 3D interactive previewing and nationwide express shipping.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Blue Area, Sector G-7/1',
      addressLocality: 'Islamabad',
      addressRegion: 'Islamabad Capital Territory',
      postalCode: '44000',
      addressCountry: 'PK'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-300-1234567',
        contactType: 'customer service',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu']
      }
    ]
  }),

  /**
   * WebSite Schema with Sitelinks Searchbox
   */
  generateWebSiteSchema: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AUTOX',
    alternateName: 'AUTOX Pakistan',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }),

  /**
   * BreadcrumbList Schema
   * @param {Array<{ name: string, url: string }>} items
   */
  generateBreadcrumbSchema: (items = []) => {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    };
  },

  /**
   * Product & Offer Schema based on actual MongoDB Product document
   */
  generateProductSchema: (product) => {
    if (!product) return null;

    const unitPrice = product.discountPercentage > 0
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : product.price;

    const images = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [`${BASE_URL}/logo.svg`];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: images,
      description: product.description || product.shortDescription || `${product.name} available at AUTOX Pakistan.`,
      sku: product.SKU,
      mpn: product.SKU,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'AUTOX Performance'
      },
      offers: {
        '@type': 'Offer',
        url: `${BASE_URL}/product/${product.slug}`,
        priceCurrency: 'PKR',
        price: unitPrice,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'AUTOX'
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: unitPrice >= 5000 ? 0 : 250,
            currency: 'PKR'
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'PK'
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'DAY'
            }
          }
        }
      }
    };

    // Include AggregateRating ONLY if genuine reviews exist
    const avgRating = product.ratingAverage || product.rating;
    const count = product.ratingCount || product.ratingsCount;
    if (count > 0 && avgRating > 0) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: count,
        bestRating: 5,
        worstRating: 1
      };
    }

    return schema;
  },

  /**
   * CollectionPage Schema for Category & Catalog Landing Pages
   */
  generateCollectionSchema: (categoryName, description, products = []) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description,
    url: `${BASE_URL}/categories`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 15).map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/product/${p.slug}`,
        name: p.name
      }))
    }
  }),

  /**
   * Editorial Article Schema for Topical Authority Guides
   */
  generateArticleSchema: (guide) => {
    if (!guide) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.metaDescription || guide.excerpt,
      image: guide.heroImage ? [guide.heroImage] : [`${BASE_URL}/logo.svg`],
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt || guide.publishedAt,
      author: {
        '@type': 'Organization',
        name: 'AUTOX Technical Engineering Team',
        url: BASE_URL
      },
      publisher: {
        '@type': 'Organization',
        name: 'AUTOX',
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.svg`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/guides/${guide.slug}`
      }
    };
  },

  /**
   * FAQPage Schema for Answer Engine Optimization (AEO)
   */
  generateFaqSchema: (faqs = []) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  })
};

// Named exports for ergonomic imports across components
export const generateOrganizationSchema = schemaGenerator.generateOrganizationSchema;
export const generateWebSiteSchema = schemaGenerator.generateWebSiteSchema;
export const generateBreadcrumbSchema = schemaGenerator.generateBreadcrumbSchema;
export const generateProductSchema = schemaGenerator.generateProductSchema;
export const generateCollectionSchema = schemaGenerator.generateCollectionSchema;
export const generateArticleSchema = schemaGenerator.generateArticleSchema;
export const generateFAQSchema = schemaGenerator.generateFaqSchema;
export const generateFaqSchema = schemaGenerator.generateFaqSchema;

export default schemaGenerator;
