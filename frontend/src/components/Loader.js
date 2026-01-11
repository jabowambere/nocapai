import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 24, className = '' }) => {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin ${className}`} 
    />
  );
};

export default Loader;
