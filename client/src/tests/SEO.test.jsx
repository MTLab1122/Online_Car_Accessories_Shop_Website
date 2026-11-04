import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SEO from '../components/common/SEO';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateCollectionSchema,
  generateArticleSchema,
  generateFAQSchema
} from '../utils/schemaGenerator';

describe('SEO Component & Schema Generator Test Suite', () => {
  it('updates document title, description, canonical link, and JSON-LD schema on render', () => {
    const testBreadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' }
    ]);

    render(
      <SEO
        title="Test Accessories Title"
        description="Test Accessories Description for Pakistan drivers"
        canonical="https://autox.pk/shop"
        keywords="car accessories, autox, pakistan"
        schema={testBreadcrumbs}
      />
    );

    expect(document.title).toBe('Test Accessories Title | AUTOX Pakistan');

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta).not.toBeNull();
    expect(descMeta.getAttribute('content')).toBe('Test Accessories Description for Pakistan drivers');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute('href')).toBe('https://autox.pk/shop');

    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    expect(scriptTag).not.toBeNull();
    const parsedSchema = JSON.parse(scriptTag.textContent);
    expect(parsedSchema['@type']).toBe('BreadcrumbList');
    expect(parsedSchema.itemListElement.length).toBe(2);
  });

  it('sets robots meta to noindex, nofollow when noindex prop is true', () => {
    render(
      <SEO
        title="Private Account"
        noindex={true}
      />
    );

    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('generates compliant Organization and WebSite schema graphs', () => {
    const org = generateOrganizationSchema();
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('AUTOX');
    expect(org.slogan).toBe('ENGINEERED FOR YOUR DRIVE.');
    expect(org.address.addressCountry).toBe('PK');

    const website = generateWebSiteSchema();
    expect(website['@type']).toBe('WebSite');
    expect(website.name).toBe('AUTOX');
    expect(website.potentialAction['@type']).toBe('SearchAction');
  });

  it('generates compliant Product and Offer schema in PKR currency', () => {
    const sampleProduct = {
      _id: 'prod123',
      name: 'Dry Carbon Fiber Spoiler',
      slug: 'dry-carbon-fiber-spoiler',
      description: 'Aerodynamic rear wing engineered for high-speed stability',
      price: 145000,
      stock: 8,
      SKU: 'AERO-WING-01',
      brand: 'AeroCraft Pro',
      rating: 4.8,
      ratingsCount: 12,
      images: ['https://images.unsplash.com/spoiler.jpg']
    };

    const schema = generateProductSchema(sampleProduct);
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Dry Carbon Fiber Spoiler');
    expect(schema.offers['@type']).toBe('Offer');
    expect(schema.offers.priceCurrency).toBe('PKR');
    expect(schema.offers.price).toBe(145000);
    expect(schema.offers.availability).toBe('https://schema.org/InStock');
    expect(schema.aggregateRating['@type']).toBe('AggregateRating');
    expect(schema.aggregateRating.ratingValue).toBe(4.8);
    expect(schema.aggregateRating.reviewCount).toBe(12);
  });

  it('generates compliant FAQPage schema for Answer Engine Optimization', () => {
    const faqs = [
      {
        question: 'Does AUTOX deliver across Pakistan?',
        answer: 'Yes, we provide express delivery across all cities in Pakistan.'
      }
    ];

    const schema = generateFAQSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity.length).toBe(1);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('Does AUTOX deliver across Pakistan?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toContain('Yes, we provide express delivery');
  });
});
