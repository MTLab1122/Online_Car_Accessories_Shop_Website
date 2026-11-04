import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: '3D Showroom', path: '/showroom', icon: Compass },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-autox-orange to-[#b33a10] flex items-center justify-center font-display font-extrabold text-xl text-white shadow-glow group-hover:scale-105 transition-transform">
              X
            </span>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                AUTO<span className="text-autox-orange">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-autox-muted -mt-1 font-mono">
                Performance Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive(link.path)
                      ? 'text-autox-orange font-semibold'
                      : 'text-autox-muted hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-autox-orange" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-autox-muted hover:text-white transition-colors rounded-lg hover:bg-autox-card/60"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 text-autox-muted hover:text-white transition-colors rounded-lg hover:bg-autox-card/60"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-autox-orange text-white text-[10px] font-bold flex items-center justify-center shadow-glow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon with Live Count */}
            <Link
              to="/cart"
              className="relative p-2 text-autox-muted hover:text-white transition-colors rounded-lg hover:bg-autox-card/60"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-autox-orange text-white text-[10px] font-bold flex items-center justify-center shadow-glow animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account Menu / Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-autox-card/80 border border-autox-border hover:border-autox-orange/50 transition-colors text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center text-autox-orange font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate font-medium text-white">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-autox-muted" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-autox-border">
                      <p className="text-xs text-autox-muted uppercase font-mono">Signed In As</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-autox-orange/20 text-autox-orange border border-autox-orange/40 uppercase">
                          Administrator
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-autox-orange hover:bg-autox-card/60 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-autox-muted hover:text-white hover:bg-autox-card/60 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-autox-muted hover:text-white hover:bg-autox-card/60 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-autox-muted hover:text-white hover:bg-autox-card/60 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Saved Items</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-autox-card/60 transition-colors border-t border-autox-border mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wider text-white hover:text-autox-orange transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-autox-muted hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="py-4 border-t border-autox-border animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aero kits, forged wheels, dashcams, exhausts, LED lights..."
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-5 py-3.5 pl-12 text-sm text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autox-muted" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-autox-bg/95 backdrop-blur-xl border-t border-autox-border p-6 flex flex-col justify-between overflow-y-auto z-40">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-display uppercase tracking-wider py-2.5 flex items-center justify-between border-b border-autox-border/40 ${
                    isActive(link.path) ? 'text-autox-orange font-bold' : 'text-autox-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-autox-orange" />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90 text-autox-muted" />
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-display uppercase tracking-wider py-2.5 text-autox-orange flex items-center gap-3 border-b border-autox-border/40 font-bold"
              >
                <Shield className="w-5 h-5 text-autox-orange" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          <div className="pt-6 border-t border-autox-border">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-lg border border-autox-border text-white text-sm font-semibold uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-lg bg-autox-orange text-white text-sm font-semibold uppercase tracking-wider shadow-glow"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 rounded-lg border border-red-500/40 text-red-400 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
