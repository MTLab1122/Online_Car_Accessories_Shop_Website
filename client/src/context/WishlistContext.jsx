import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('[WishlistContext] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save items to your wishlist.');
      return;
    }

    try {
      if (isInWishlist(productId)) {
        const res = await wishlistService.removeFromWishlist(productId);
        if (res.success) {
          setWishlist(res.data);
          toast.success('Removed from wishlist.');
        }
      } else {
        const res = await wishlistService.addToWishlist(productId);
        if (res.success) {
          setWishlist(res.data);
          toast.success('Added to wishlist!');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist.');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success) {
        setWishlist(res.data);
        toast.success('Removed from wishlist.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not remove item.');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

