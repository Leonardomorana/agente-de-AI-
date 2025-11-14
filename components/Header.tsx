import React from 'react';

const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    <line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
            <BuildingIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            <span className="text-orange-400">Morana</span> Encorp
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
