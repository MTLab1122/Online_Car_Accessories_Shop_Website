import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    logout: vi.fn()
  })
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ itemCount: 3 })
}));

vi.mock('../context/WishlistContext', () => ({
  useWishlist: () => ({ wishlist: [{ _id: '1' }] })
}));

describe('Frontend Navbar Component Test', () => {
  it('renders AUTOX brand name and primary navigation routes', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('AUTO')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('3D Showroom')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('displays live cart item count badge', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

