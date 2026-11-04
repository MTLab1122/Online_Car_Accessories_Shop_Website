import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartDrawer } from '../components/cart/CartDrawer';

const mockCloseDrawer = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();
const mockApplyCoupon = vi.fn();
const mockRemoveCoupon = vi.fn();

const mockUseCart = vi.fn();

vi.mock('../context/CartContext', () => ({
  useCart: () => mockUseCart()
}));

describe('CartDrawer Component Test', () => {
  it('renders empty cart state with prompt to explore showroom', () => {
    mockUseCart.mockReturnValue({
      cart: { items: [], subtotal: 0, total: 0 },
      isDrawerOpen: true,
      closeDrawer: mockCloseDrawer,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      applyCoupon: mockApplyCoupon,
      removeCoupon: mockRemoveCoupon
    });

    render(
      <BrowserRouter>
        <CartDrawer />
      </BrowserRouter>
    );

    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    expect(screen.getByText('Explore Catalog')).toBeInTheDocument();
  });

  it('renders line items, progress bar to free shipping, and totals', () => {
    mockUseCart.mockReturnValue({
      cart: {
        items: [
          {
            product: {
              _id: 'prod1',
              name: 'Titanium Valved Exhaust',
              slug: 'titanium-valved-exhaust',
              images: ['https://example.com/exhaust.jpg'],
              price: 185000
            },
            quantity: 1,
            price: 185000,
            total: 185000
          }
        ],
        subtotal: 185000,
        discount: 0,
        shippingFee: 0,
        total: 185000
      },
      isDrawerOpen: true,
      closeDrawer: mockCloseDrawer,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      applyCoupon: mockApplyCoupon,
      removeCoupon: mockRemoveCoupon
    });

    render(
      <BrowserRouter>
        <CartDrawer />
      </BrowserRouter>
    );

    expect(screen.getByText('Titanium Valved Exhaust')).toBeInTheDocument();
    expect(screen.getByText(/Complimentary Shipping Unlocked!/)).toBeInTheDocument();
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });
});
