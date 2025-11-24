
import React, { useState, memo } from 'react';
import { FAQ_DATA } from '../constants';
import { FaqItem } from '../types';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const AccordionItem: React.FC<{ item: FaqItem; isOpen: boolean; onClick: () => void; }> = memo(({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50 transition-colors focus:outline-none rounded-lg group"
      >
        <h3 className={`text-base md:text-lg font-semibold transition-colors ${isOpen ? 'text-red-700' : 'text-gray-800 group-hover:text-red-700'}`}>
            {item.question}
        </h3>
        <span className={`flex-shrink-0 ml-4 p-1 rounded-full ${isOpen ? 'bg-red-50' : 'bg-transparent group-hover:bg-gray-100'}`}>
             <ChevronDownIcon className={`w-5 h-5 text-red-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-2 text-gray-600 leading-relaxed text-sm md:text-base border-l-2 border-red-200 pl-4 ml-2">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
});

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto animate-fadeInUp">
       <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
            <p className="text-gray-500 mt-2">Respostas rápidas para suas principais dúvidas</p>
       </div>
      {FAQ_DATA.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default memo(FAQ);
