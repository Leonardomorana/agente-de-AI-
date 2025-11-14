import React, { useState } from 'react';
import Header from './components/Header';
import ChatAgent from './components/ChatAgent';
import FAQ from './components/FAQ';

type Tab = 'chat' | 'faq';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col max-w-4xl">
        <div className="flex justify-center border-b border-gray-700 mb-6">
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
        </div>
        <div className="flex-grow flex flex-col">
          {activeTab === 'chat' && <ChatAgent />}
          {activeTab === 'faq' && <FAQ />}
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
      className={`py-3 px-6 text-sm md:text-base font-semibold transition-colors duration-300 focus:outline-none ${
        isActive
          ? 'border-b-2 border-orange-500 text-orange-400'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};


export default App;
