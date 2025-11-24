
import React, { memo } from 'react';
import { MORANA_ENCORP_LOGO } from '../assets/logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 border-t-4 border-t-red-700">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-center items-center">
        <img 
          src={MORANA_ENCORP_LOGO} 
          alt="Morana Encorp Logo" 
          className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105 duration-300"
          loading="eager"
        />
      </div>
    </header>
  );
};

export default memo(Header);
