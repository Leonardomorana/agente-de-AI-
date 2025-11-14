import React from 'react';
import { MORANA_ENCORP_LOGO } from '../assets/logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <img src={MORANA_ENCORP_LOGO} alt="Morana Encorp Logo" className="h-8" />
        </div>
      </div>
    </header>
  );
};

export default Header;