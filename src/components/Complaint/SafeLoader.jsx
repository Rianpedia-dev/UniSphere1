import React from 'react';

const SafeLoader = ({ size = 24, className = '' }) => {
  return (
    <svg 
      className={`cp-safe-loader ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        className="cp-safe-loader-ring"
        cx="12" 
        cy="12" 
        r="10" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SafeLoader;