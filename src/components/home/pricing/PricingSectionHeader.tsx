
import React from 'react';

interface PricingSectionHeaderProps {
  title: string;
  subtitle: string;
}

const PricingSectionHeader: React.FC<PricingSectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-mkranker-purple to-mkranker-blue bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </>
  );
};

export default PricingSectionHeader;
