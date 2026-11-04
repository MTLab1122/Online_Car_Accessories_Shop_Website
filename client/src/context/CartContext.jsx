import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 0,
    coupon: null
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('[CartContext] fetchCart error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const res = await cartService.addItem(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        toast.success('Item added to cart!');
      }
    } catch (err) {
      toast.error(err.message || 'Could not add item to cart.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const res = await cartService.updateQuantity(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Could not update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      const res = await cartService.removeItem(productId);
      if (res.success && res.data) {
        setCart(res.data);
        toast.success('Item removed from cart.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not remove item.');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    try {
      setLoading(true);
      const res = await cartService.applyCoupon(code);
      if (res.success && res.data) {
        setCart(res.data);
        toast.success(res.message || 'Coupon applied successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid or expired coupon.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    try {
      setLoading(true);
      const res = await cartService.removeCoupon();
      if (res.success && res.data) {
        setCart(res.data);
        toast.success('Coupon removed.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not remove coupon.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.clearCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount: cart.itemCount || 0,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        refreshCart: fetchCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

