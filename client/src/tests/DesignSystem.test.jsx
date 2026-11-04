import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PriceDisplay from '../components/ui/PriceDisplay';
import StockIndicator from '../components/ui/StockIndicator';
import { EyebrowLabel, SectionHeading } from '../components/ui/Typography';

describe('Design System UI Components', () => {
  describe('PriceDisplay', () => {
    it('formats PKR price with authoritative symbol', () => {
      render(<PriceDisplay price={45000} />);
      expect(screen.getByText('₨')).toBeInTheDocument();
      expect(screen.getByText('45,000')).toBeInTheDocument();
      expect(screen.getByText('PKR')).toBeInTheDocument();
    });

    it('calculates discounted price and displays savings strikethrough', () => {
      // 100,000 with 20% discount = 80,000
      render(<PriceDisplay price={100000} discountPercentage={20} />);
      expect(screen.getByText('80,000')).toBeInTheDocument();
      expect(screen.getByText(/100,000/)).toBeInTheDocument();
      expect(screen.getByText(/-20%/)).toBeInTheDocument();
    });
  });

  describe('StockIndicator', () => {
    it('renders "In Stock" when stock is healthy', () => {
      render(<StockIndicator stock={25} showCount={true} />);
      expect(screen.getByText(/25 In Stock/)).toBeInTheDocument();
    });

    it('renders "Low Stock" alert when stock is under 5', () => {
      render(<StockIndicator stock={3} />);
      expect(screen.getByText(/Only 3 Left/)).toBeInTheDocument();
    });

    it('renders "Sold Out" when stock is 0', () => {
      render(<StockIndicator stock={0} />);
      expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });
  });

  describe('Typography Components', () => {
    it('renders EyebrowLabel with text and styling', () => {
      render(<EyebrowLabel text="AERODYNAMICS DIVISION" />);
      expect(screen.getByText('AERODYNAMICS DIVISION')).toBeInTheDocument();
    });

    it('renders SectionHeading with eyebrow, title, and subtitle', () => {
      render(
        <SectionHeading
          eyebrow="ENGINEERING SHOWCASE"
          title="PRECISION TUNED"
          subtitle="Built for high-velocity track performance in Pakistan"
        />
      );
      expect(screen.getByText('ENGINEERING SHOWCASE')).toBeInTheDocument();
      expect(screen.getByText('PRECISION TUNED')).toBeInTheDocument();
      expect(screen.getByText('Built for high-velocity track performance in Pakistan')).toBeInTheDocument();
    });
  });
});
