import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ items = [], className = '' }) => {
  return (
    <nav aria-label="Breadcrumbs" className={`flex items-center gap-2 text-xs font-mono text-autox-muted mb-6 flex-wrap ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-autox-borderLight flex-shrink-0" />}
            {isLast ? (
              <span className="text-white truncate max-w-[200px] sm:max-w-xs font-medium">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.url}
                className="hover:text-autox-orange transition-colors truncate max-w-[140px] sm:max-w-none"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
