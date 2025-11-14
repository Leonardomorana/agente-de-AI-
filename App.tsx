import React, { useState } from 'react';
import Header from './components/Header';
import ChatAgent from './components/ChatAgent';
import FAQ from './components/FAQ';
import FinancingComparison from './components/FinancingComparison';

type Tab = 'chat' | 'faq' | 'comparativo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col max-w-4xl">
        <div className="flex justify-center border-b border-gray-300 mb-6 flex-wrap">
          <TabButton
            label="Agente de IA"
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
          <TabButton
            label="Perguntas Frequentes (FAQ)"
            isActive={activeTab === 'faq'}
            onClick={() => setActiveTab('faq')}
          />
          <TabButton
            label="Comparativo de Financiamento"
            isActive={activeTab === 'comparativo'}
            onClick={() => setActiveTab('comparativo')}
          />
        </div>
        <div className="flex-grow flex flex-col">
          {activeTab === 'chat' && <ChatAgent />}
          {activeTab === 'faq' && <FAQ />}
          {activeTab === 'comparativo' && <FinancingComparison />}
        </div>
      </main>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-4 md:px-6 text-sm md:text-base font-semibold transition-colors duration-300 focus:outline-none whitespace-nowrap ${
        isActive
          ? 'border-b-2 border-red-700 text-red-700'
          : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
};


export default App;