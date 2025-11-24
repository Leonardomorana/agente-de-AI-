
import React, { useState, Suspense, lazy } from 'react';
import Header from './components/Header';

// Lazy load components to split the bundle and improve initial load time
const ChatAgent = lazy(() => import('./components/ChatAgent'));
const FAQ = lazy(() => import('./components/FAQ'));
const FinancingComparison = lazy(() => import('./components/FinancingComparison'));

type Tab = 'chat' | 'faq' | 'comparativo';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64 w-full">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-red-700 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm font-medium">Carregando...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  // Prefetch tabs on hover for better perceived performance
  const handleMouseEnter = (tab: Tab) => {
    if (tab === 'chat') import('./components/ChatAgent');
    if (tab === 'faq') import('./components/FAQ');
    if (tab === 'comparativo') import('./components/FinancingComparison');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col max-w-5xl">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col flex-grow overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-2 pt-2 md:px-6 md:pt-4 flex justify-center md:justify-start overflow-x-auto no-scrollbar">
            <div className="flex space-x-1 md:space-x-2 w-full md:w-auto">
              <TabButton
                label="Agente Virtual"
                icon={<ChatIcon />}
                isActive={activeTab === 'chat'}
                onClick={() => setActiveTab('chat')}
                onMouseEnter={() => handleMouseEnter('chat')}
              />
              <TabButton
                label="Perguntas Frequentes"
                icon={<FaqIcon />}
                isActive={activeTab === 'faq'}
                onClick={() => setActiveTab('faq')}
                onMouseEnter={() => handleMouseEnter('faq')}
              />
              <TabButton
                label="Comparativo"
                icon={<CompareIcon />}
                isActive={activeTab === 'comparativo'}
                onClick={() => setActiveTab('comparativo')}
                onMouseEnter={() => handleMouseEnter('comparativo')}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow relative flex flex-col overflow-hidden bg-white">
            <Suspense fallback={<LoadingSpinner />}>
              <div className="absolute inset-0 flex flex-col">
                {activeTab === 'chat' && <ChatAgent />}
                {activeTab === 'faq' && <div className="overflow-y-auto h-full p-4 md:p-8"><FAQ /></div>}
                {activeTab === 'comparativo' && <div className="overflow-y-auto h-full p-4 md:p-8"><FinancingComparison /></div>}
              </div>
            </Suspense>
          </div>
        </div>
        
        <footer className="text-center p-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Morana Encorp. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick, onMouseEnter }) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        group flex items-center gap-2 py-3 px-4 md:px-6 rounded-t-lg text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap focus:outline-none flex-1 md:flex-none justify-center
        ${isActive 
          ? 'bg-white text-red-700 border-t-2 border-x border-gray-200 border-t-red-600 shadow-[0_-2px_5px_rgba(0,0,0,0.02)] relative top-[1px] z-10' 
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 border-transparent'
        }
      `}
    >
      {icon && <span className={`${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</span>}
      {label}
    </button>
  );
};

// Simple Icons
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const FaqIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const CompareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);

export default App;
