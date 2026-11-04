import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X
} from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import QuickViewModal from '../../components/products/QuickViewModal';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL query parameters
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Update URL search parameters
  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Remove empty/default values
    Object.keys(merged).forEach((key) => {
      if (merged[key] === '' || merged[key] === null || merged[key] === undefined) {
        delete merged[key];
      }
    });

    setSearchParams(merged);
  };

  // Fetch products matching filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        inStock,
        sort,
        page,
        limit: 12
      };

      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, brand, minPrice, maxPrice, rating, inStock, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const brandsList = [
    'AeroCraft Pro',
    'Apex Motorsport',
    'CorsaLux',
    'DetailMaster',
    'ForgedLab',
    'LuminaDrive',
    'SafeDrive Pro',
    'SonicBlast Audio',
    'TireGuard Pro',
    'TitanRoar',
    'Vanguard Vision',
    'Veloce Dynamics'
  ];

  return (
    <div className="min-h-screen bg-autox-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-autox-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Automotive Hardware Registry
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
              Shop Accessories
            </h1>
            <p className="text-xs text-autox-muted mt-1 font-mono">
              Showing {pagination.total} engineered accessories in Pakistan (PKR)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-autox-card border border-autox-border text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-autox-orange" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-autox-card border border-autox-border rounded-xl px-3 py-2">
              <SlidersHorizontal className="w-4 h-4 text-autox-orange" />
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-semibold uppercase tracking-wider text-white focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-autox-card text-white">Newest Additions</option>
                <option value="price-asc" className="bg-autox-card text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-autox-card text-white">Price: High to Low</option>
                <option value="rating" className="bg-autox-card text-white">Customer Rating</option>
                <option value="name-asc" className="bg-autox-card text-white">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-autox-border space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-autox-border">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-autox-orange" />
                  Filter Equipment
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-mono text-autox-muted hover:text-autox-orange flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Keyword Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
                    placeholder="Search accessories..."
                    className="w-full bg-autox-dark border border-autox-border rounded-lg px-3 py-2 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
                  />
                  {search && (
                    <button
                      onClick={() => updateParams({ search: '', page: 1 })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-autox-muted hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Category Division
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateParams({ category: '', page: 1 })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      !category
                        ? 'bg-autox-orange/20 text-autox-orange font-bold'
                        : 'text-autox-silver hover:bg-autox-dark'
                    }`}
                  >
                    <span>All Divisions</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateParams({ category: cat.slug, page: 1 })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        category === cat.slug
                          ? 'bg-autox-orange/20 text-autox-orange font-bold'
                          : 'text-autox-silver hover:bg-autox-dark'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className="text-[10px] font-mono text-autox-muted">
                          {cat.productCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Price Limit (PKR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => updateParams({ minPrice: e.target.value, page: 1 })}
                    placeholder="Min"
                    className="w-full bg-autox-dark border border-autox-border rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value, page: 1 })}
                    placeholder="Max"
                    className="w-full bg-autox-dark border border-autox-border rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>
              </div>

              {/* In-Stock Filter */}
              <div className="pt-2 border-t border-autox-border/60">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => updateParams({ inStock: e.target.checked ? 'true' : '', page: 1 })}
                    className="w-4 h-4 rounded border-autox-border text-autox-orange focus:ring-0 bg-autox-dark cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Minimum Rating */}
              <div className="pt-2 border-t border-autox-border/60">
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Customer Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateParams({ rating: rating === String(r) ? '' : String(r), page: 1 })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        rating === String(r)
                          ? 'border-autox-orange bg-autox-orange/20 text-autox-orange'
                          : 'border-autox-border bg-autox-dark text-autox-muted hover:text-white'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current text-amber-400" />
                      <span>{r}+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-2 border-t border-autox-border/60">
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Performance Brands
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {brandsList.map((b) => (
                    <button
                      key={b}
                      onClick={() => updateParams({ brand: brand === b ? '' : b, page: 1 })}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                        brand === b
                          ? 'text-autox-orange font-bold bg-autox-orange/10'
                          : 'text-autox-silver hover:text-white'
                      }`}
                    >
                      <span>{b}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid & Results Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                      disabled={page <= 1}
                      className="p-2.5 rounded-xl border border-autox-border bg-autox-card text-white hover:border-autox-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {Array.from({ length: pagination.totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateParams({ page: pageNum })}
                            className={`w-9 h-9 rounded-xl font-bold transition-all ${
                              page === pageNum
                                ? 'bg-autox-orange text-white shadow-glow'
                                : 'bg-autox-card border border-autox-border text-autox-silver hover:text-white hover:border-autox-orange'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => updateParams({ page: Math.min(pagination.totalPages, page + 1) })}
                      disabled={page >= pagination.totalPages}
                      className="p-2.5 rounded-xl border border-autox-border bg-autox-card text-white hover:border-autox-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center border border-autox-border">
                <PackageOpen className="w-12 h-12 text-autox-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold font-display text-white mb-1">
                  No Accessories Found
                </h3>
                <p className="text-xs text-autox-muted max-w-sm mx-auto mb-6">
                  No products matched your exact filter parameters. Try expanding your search or resetting active filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider shadow-glow hover:bg-autox-orangeHover transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;

