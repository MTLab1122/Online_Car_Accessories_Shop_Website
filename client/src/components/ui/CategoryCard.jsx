import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CategoryCard = ({ category }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';
  const imageUrl = category.image || fallbackImage;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-autox-border hover:border-autox-orange/60 transition-all duration-300 flex flex-col justify-end aspect-[16/11] shadow-card hover:shadow-glow"
    >
      {/* Background Photography */}
      <img
        src={imageUrl}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-110"
      />

      {/* Cinematic Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 group-hover:via-black/50 transition-colors" />

      {/* Orange Subtle Accent Line at bottom on hover */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-autox-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Card Content Overlay */}
      <div className="relative p-6 z-10 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-autox-orange bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-autox-orange/20">
            {category.productCount !== undefined ? `${category.productCount} Components` : 'Division'}
          </span>
          <span className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-autox-orange flex items-center justify-center group-hover:bg-autox-orange group-hover:text-white transition-all transform group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-autox-orange transition-colors uppercase tracking-tight">
          {category.name}
        </h3>

        <p className="text-xs text-autox-silver line-clamp-2 mt-1.5 leading-relaxed font-sans opacity-90">
          {category.description}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;

