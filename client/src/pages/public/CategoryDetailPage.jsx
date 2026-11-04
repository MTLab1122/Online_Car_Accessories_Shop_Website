import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PackageOpen, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import QuickViewModal from '../../components/products/QuickViewModal';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import { categoryService } from '../../services/categoryService';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getCategoryBySlug(slug);
        if (res.success && res.data) {
          setCategory(res.data.category);
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-autox-card rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <PackageOpen className="w-16 h-16 text-autox-muted mb-4" />
        <h2 className="text-2xl font-bold font-display text-white mb-2">Category Not Found</h2>
        <p className="text-xs text-autox-muted mb-6">The category division you requested does not exist.</p>
        <Link to="/categories" className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-autox-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-autox-muted hover:text-autox-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Divisions</span>
        </Link>

        {/* Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-autox-border mb-12 p-8 sm:p-12 bg-gradient-to-r from-autox-dark via-[#10151c] to-autox-bg">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
              Division Architecture
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-3 uppercase">
              {category.name}
            </h1>
            <p className="text-sm text-autox-silver mt-2 leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 text-xs font-mono text-autox-muted">
              {products.length} registered component(s) in this division
            </div>
          </div>
        </div>

        {/* Products in this category */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center border border-autox-border">
            <PackageOpen className="w-12 h-12 text-autox-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold font-display text-white mb-1">
              No Accessories Currently Listed
            </h3>
            <p className="text-xs text-autox-muted max-w-sm mx-auto mb-6">
              New arrivals for this division are currently undergoing QA staging.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider shadow-glow"
            >
              Browse Full Shop
            </Link>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default CategoryDetailPage;
