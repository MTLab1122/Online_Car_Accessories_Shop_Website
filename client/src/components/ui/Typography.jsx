import React from 'react';

export const EyebrowLabel = ({
  children,
  text,
  icon: Icon,
  className = ''
}) => {
  const content = children || text;
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-autox-orange/10 border border-autox-orange/20 text-autox-orange text-xs font-mono uppercase tracking-widest ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{content}</span>
    </div>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
  className = '',
  eyebrowIcon
}) => {
  const alignClass = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start',
    right: 'text-right items-end'
  }[align] || 'text-center mx-auto items-center';

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <EyebrowLabel icon={eyebrowIcon} className="mb-3.5">
          {eyebrow}
        </EyebrowLabel>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
        {title}{' '}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-autox-orange to-[#ff8555]">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="mt-3.5 text-sm sm:text-base text-autox-muted font-sans leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
