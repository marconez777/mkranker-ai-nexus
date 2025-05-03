
import React from 'react';
import SectionHeader from '../SectionHeader';

interface PricingSectionHeaderProps {
  title: string;
  subtitle: string;
}

const PricingSectionHeader: React.FC<PricingSectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      variant="gradient"
    />
  );
};

export default PricingSectionHeader;
