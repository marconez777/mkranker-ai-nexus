
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'gradient' | 'blurry';
  alignment?: 'center' | 'left';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  variant = 'default',
  alignment = 'center'
}) => {
  const alignmentClasses = alignment === 'center' ? 'text-center' : 'text-left';
  
  let titleClasses = `text-4xl font-bold mb-6 ${alignmentClasses}`;
  
  if (variant === 'gradient') {
    titleClasses += ' bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent';
  }
  
  return (
    <div className={`mb-16 ${alignmentClasses}`}>
      {variant === 'blurry' ? (
        <h2 className={`${titleClasses} relative`}>
          {/* Smoky/blurry purple text effect */}
          <span className="relative z-10 bg-gradient-to-r from-mkranker-purple via-purple-500 to-mkranker-blue bg-clip-text text-transparent">
            {title}
          </span>
          <span className="absolute inset-0 blur-sm bg-gradient-to-r from-mkranker-purple via-purple-400 to-mkranker-blue opacity-40 bg-clip-text text-transparent z-0">
            {title}
          </span>
        </h2>
      ) : (
        <h2 className={titleClasses}>{title}</h2>
      )}
      
      {subtitle && (
        <p className={`text-xl text-gray-600 ${alignment === 'center' ? 'max-w-3xl mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
