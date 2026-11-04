import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

// Mock contexts
const mockAddItem = vi.fn();
const mockToggleWishlist = vi.fn();

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem })
}));

vi.mock('../context/WishlistContext', () => ({
  useWishlist: () => ({
    isInWishlist: () => false,
    toggleWishlist: mockToggleWishlist
  })
}));

describe('Frontend ProductCard Component Test', () => {
  const dummyProduct = {
    _id: 'prod123',
    name: 'Carbon Fiber GT Wing',
    slug: 'carbon-fiber-gt-wing',
    SKU: 'EXT-CF-SP01',
    brand: 'AeroCraft Pro',
    price: 85000,
    discountPercentage: 10,
    stock: 14,
    images: ['https://example.com/wing.jpg'],
    category: { name: 'Exterior Accessories', slug: 'exterior' },
    ratingAverage: 4.9,
    ratingCount: 18,
    isFeatured: true
  };

  it('renders product name, brand, and formatted PKR price correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={dummyProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Carbon Fiber GT Wing')).toBeInTheDocument();
    expect(screen.getByText('AeroCraft Pro')).toBeInTheDocument();
    // 85000 with 10% discount is 76,500
    expect(screen.getByText(/76,500/)).toBeInTheDocument();
    expect(screen.getByText(/-10% OFF/)).toBeInTheDocument();
  });

  it('calls addItem when Add to Cart button is triggered', () => {
    render(
      <BrowserRouter>
        <ProductCard product={dummyProduct} />
      </BrowserRouter>
    );

    const addButton = screen.getByTitle('Add to Shopping Cart');
    fireEvent.click(addButton);
    expect(mockAddItem).toHaveBeenCalledWith('prod123', 1);
  });

  it('calls toggleWishlist when wishlist button is clicked', () => {
    render(
      <BrowserRouter>
        <ProductCard product={dummyProduct} />
      </BrowserRouter>
    );

    const wishlistBtn = screen.getByTitle('Add to Wishlist');
    fireEvent.click(wishlistBtn);
    expect(mockToggleWishlist).toHaveBeenCalledWith('prod123');
  });
});

