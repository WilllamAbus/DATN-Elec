
import React from 'react';

interface AvatarFallbackProps {
  name: string;
  className?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ name, className = '' }) => {
  return (
    <div className={`h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold ${className}`}>
      {name.charAt(0)}
    </div>
  );
};

export default AvatarFallback;
