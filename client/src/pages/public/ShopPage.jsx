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
import SEO from '../../components/common/SEO';
import { generateBreadcrumbSchema, generateCollectionSchema } from '../../utils/schemaGenerator';
import { analytics } from '../../utils/analytics';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Drawer from '../../components/ui/Drawer';
import EmptyState from '../../components/ui/EmptyState';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';

export const ShopPage = () => {
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
        analytics.viewItemList(res.data, 'Catalog Shop View');
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

  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbsList);
  const collectionSchema = generateCollectionSchema({
    title: search ? `Search: ${search} | AUTOX Shop` : 'All High-Performance Car Accessories | AUTOX Pakistan',
    description: 'Explore the full catalog of verified car accessories in Pakistan. Carbon aerodynamic kits, interior luxury accessories, LED lights, dashcams, and forged wheels.',
    url: page > 1 ? `https://autox.pk/shop?page=${page}` : 'https://autox.pk/shop',
    items: products.map(p => ({
      name: p.name,
      url: `https://autox.pk/product/${p.slug}`,
      image: p.images?.[0]?.url || p.images?.[0]
    }))
  });

  const hasActiveFilters = Boolean(search || category || brand || minPrice || maxPrice || inStock);

  // Common Filter Content for Sidebar & Drawer
  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Category Division Filter */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2.5">
          Division Category
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => updateParams({ category: '', page: 1 })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
              !category
                ? 'bg-autox-orange/15 text-autox-orange font-bold border border-autox-orange/30'
                : 'text-autox-silver hover:text-white hover:bg-autox-card'
            }`}
          >
            <span>All Equipment</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParams({ category: cat._id, page: 1 })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                category === cat._id
                  ? 'bg-autox-orange/15 text-autox-orange font-bold border border-autox-orange/30'
                  : 'text-autox-silver hover:text-white hover:bg-autox-card'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter (PKR) */}
      <div className="pt-4 border-t border-autox-border">
        <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2.5">
          Price Range (PKR ₨)
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="number"
            placeholder="Min ₨"
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value, page: 1 })}
            className="w-full bg-autox-dark border border-autox-border rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
          />
          <input
            type="number"
            placeholder="Max ₨"
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value, page: 1 })}
            className="w-full bg-autox-dark border border-autox-border rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
          />
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-4 border-t border-autox-border">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParams({ inStock: e.target.checked ? 'true' : '', page: 1 })}
            className="w-4 h-4 rounded bg-autox-dark border-autox-border text-autox-orange focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs font-mono uppercase tracking-wider text-autox-silver hover:text-white">
            In Stock Units Only
          </span>
        </label>
      </div>

      {/* Brand Selection */}
      <div className="pt-4 border-t border-autox-border">
        <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2.5">
          Manufacturer Brand
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => updateParams({ brand: '', page: 1 })}
            className={`w-full text-left px-3 py-1 rounded text-xs font-mono transition-colors ${
              !brand ? 'text-autox-orange font-bold' : 'text-autox-silver hover:text-white'
            }`}
          >
            All Brands
          </button>
          {brandsList.map((b) => (
            <button
              key={b}
              onClick={() => updateParams({ brand: b, page: 1 })}
              className={`w-full text-left px-3 py-1 rounded text-xs font-mono transition-colors ${
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
  );

  return (
    <div className="min-h-screen bg-autox-bg py-10">
      <SEO
        title={search ? `Search results for "${search}" | AUTOX Shop` : 'Shop High-Performance Car Accessories Pakistan | AUTOX'}
        description="Browse premium automotive accessories in Pakistan with nationwide delivery. Carbon fiber spoilers, 3D laser-fit floor mats, LED headlights, dashcams, and forged rims in PKR."
        canonical={page > 1 ? `https://autox.pk/shop?page=${page}` : 'https://autox.pk/shop'}
        keywords="car accessories online shop pakistan, buy car parts lahore karachi, auto accessories pkr, car upgrades islamabad"
        schema={[breadcrumbSchema, collectionSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={breadcrumbsList} />

        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-autox-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Automotive Hardware Registry
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase tracking-tight">
              Hardware Catalog
            </h1>
            <p className="text-xs text-autox-muted mt-1.5 font-mono">
              Displaying {pagination.total} track-proven accessories in Pakistani Rupees (₨)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-autox-card border border-autox-border text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 hover:border-autox-orange/50 transition-colors"
            >
              <Filter className="w-4 h-4 text-autox-orange" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-autox-card border border-autox-border rounded-xl px-3.5 py-2">
              <SlidersHorizontal className="w-4 h-4 text-autox-orange" />
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-display font-bold uppercase tracking-wider text-white focus:outline-none cursor-pointer"
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

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs font-mono text-autox-muted mr-1">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autox-orange/15 border border-autox-orange/30 text-xs font-mono text-white">
                Query: "{search}"
                <button onClick={() => updateParams({ search: '' })}><X className="w-3 h-3 text-autox-orange" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autox-orange/15 border border-autox-orange/30 text-xs font-mono text-white">
                Category Active
                <button onClick={() => updateParams({ category: '' })}><X className="w-3 h-3 text-autox-orange" /></button>
              </span>
            )}
            {brand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autox-orange/15 border border-autox-orange/30 text-xs font-mono text-white">
                Brand: {brand}
                <button onClick={() => updateParams({ brand: '' })}><X className="w-3 h-3 text-autox-orange" /></button>
              </span>
            )}
            {inStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autox-orange/15 border border-autox-orange/30 text-xs font-mono text-white">
                In Stock Only
                <button onClick={() => updateParams({ inStock: '' })}><X className="w-3 h-3 text-autox-orange" /></button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-autox-muted hover:text-white underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout (Sidebar + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-autox-border space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-autox-border">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-autox-orange" />
                  Filter Parameters
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-mono text-autox-muted hover:text-autox-orange flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {renderFilterControls()}
            </div>
          </aside>

          {/* Products Grid & Results Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  <div className="mt-14 flex items-center justify-center gap-2">
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
              <EmptyState
                title="No Accessories Found"
                description="No products matched your exact filter parameters. Expand your search or clear active filters."
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Equipment"
        subtitle="Refine catalog parameters"
        width="max-w-sm"
      >
        <div className="py-2">
          {renderFilterControls()}

          <div className="mt-8 pt-4 border-t border-autox-border grid grid-cols-2 gap-3">
            <SecondaryButton onClick={handleResetFilters} size="sm">
              Reset Filters
            </SecondaryButton>
            <PrimaryButton onClick={() => setFilterDrawerOpen(false)} size="sm">
              Show Results
            </PrimaryButton>
          </div>
        </div>
      </Drawer>

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
