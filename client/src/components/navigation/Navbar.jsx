import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Compass,
  Shield,
  LogOut,
  Package,
  Layers,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchOverlay from './SearchOverlay';
import CartDrawer from '../cart/CartDrawer';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const { wishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Guides', path: '/guides' },
    { name: '3D Showroom', path: '/showroom', icon: Compass },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? 'glass-nav-scrolled shadow-2xl py-3.5' : 'glass-nav py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Signature */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-autox-orange via-[#ea4f18] to-[#b33a10] flex items-center justify-center font-display font-extrabold text-xl text-white shadow-glow group-hover:scale-105 transition-transform flex-shrink-0">
                X
              </span>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-wider text-white leading-none">
                  AUTO<span className="text-autox-orange">X</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-autox-muted font-mono mt-0.5">
                  Performance Lab
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-xs uppercase tracking-wider font-display font-bold py-1.5 transition-colors duration-200 flex items-center gap-1.5 ${
                      active ? 'text-autox-orange' : 'text-autox-silver hover:text-white'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-autox-orange" />}
                    <span>{link.name}</span>

                    {/* Active Route Accent Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-autox-orange shadow-glow"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={() => setSearchOverlayOpen(true)}
                aria-label="Search catalog"
                className="p-2.5 text-autox-silver hover:text-white transition-colors rounded-xl hover:bg-autox-card/80 border border-transparent hover:border-autox-border"
                title="Search Products (ESC)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/account?tab=wishlist"
                aria-label="Saved wishlist"
                className="relative p-2.5 text-autox-silver hover:text-white transition-colors rounded-xl hover:bg-autox-card/80 border border-transparent hover:border-autox-border"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-[17px] rounded-full bg-autox-orange text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-glow">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => {
                  if (openDrawer) openDrawer();
                }}
                aria-label="Open shopping cart"
                className="relative p-2.5 text-autox-silver hover:text-white transition-colors rounded-xl hover:bg-autox-card/80 border border-transparent hover:border-autox-border"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 min-w-[17px] h-[17px] rounded-full bg-autox-orange text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-glow animate-pulse"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Account Menu / Login Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-autox-card border border-autox-border hover:border-autox-orange/50 transition-colors text-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center text-autox-orange font-bold font-mono text-[11px] uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate font-medium text-white">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-autox-muted" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-autox-surface border border-autox-border rounded-xl shadow-2xl py-2 z-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-autox-border">
                          <p className="text-[10px] text-autox-muted uppercase font-mono">Signed In As</p>
                          <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
                          {isAdmin && (
                            <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-autox-orange/20 text-autox-orange border border-autox-orange/40 uppercase">
                              Root Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-display font-bold text-autox-orange hover:bg-autox-card transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Mission Control</span>
                          </Link>
                        )}

                        <Link
                          to="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-autox-silver hover:text-white hover:bg-autox-card transition-colors"
                        >
                          <User className="w-4 h-4 text-autox-muted" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/account?tab=orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-autox-silver hover:text-white hover:bg-autox-card transition-colors"
                        >
                          <Package className="w-4 h-4 text-autox-muted" />
                          <span>Order History</span>
                        </Link>

                        <Link
                          to="/account?tab=wishlist"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-autox-silver hover:text-white hover:bg-autox-card transition-colors"
                        >
                          <Heart className="w-4 h-4 text-autox-muted" />
                          <span>Saved Wishlist</span>
                        </Link>

                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-autox-card transition-colors border-t border-autox-border mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold uppercase tracking-wider text-autox-silver hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-display font-bold uppercase tracking-wider shadow-glow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 text-autox-silver hover:text-white rounded-lg hover:bg-autox-card"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-autox-surface border-t border-autox-border px-6 py-6 overflow-hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-2 mb-6">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`text-base font-display font-bold uppercase tracking-wider py-3 px-3 rounded-xl flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-autox-orange/15 text-autox-orange border border-autox-orange/30'
                          : 'text-autox-silver hover:text-white hover:bg-autox-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 text-autox-orange" />}
                        <span>{link.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-autox-muted" />
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-base font-display font-bold uppercase tracking-wider py-3 px-3 rounded-xl flex items-center justify-between text-autox-orange bg-autox-orange/10 border border-autox-orange/20 mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-autox-orange" />
                      <span>Mission Control</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-autox-border">
                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-xl border border-autox-border text-white text-xs font-display font-bold uppercase tracking-wider hover:bg-autox-card"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-3 rounded-xl bg-autox-orange text-white text-xs font-display font-bold uppercase tracking-wider shadow-glow"
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Interactive Overlays */}
      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
      />
      <CartDrawer />
    </>
  );
};

export default Navbar;
