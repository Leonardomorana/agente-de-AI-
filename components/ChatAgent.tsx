
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageAuthor } from '../types';
import { createChatSession, sendMessageToAI } from '../services/geminiService';
import { Chat } from '@google/genai';
import { marked } from 'marked';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const AiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m14 16.2-2 2.1-2-2.1"></path></svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
);

// Safer ID generator for compatibility
const generateId = () => Math.random().toString(36).substring(2, 15);

const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: generateId(), author: MessageAuthor.AI, text: "Olá! Sou o assistente virtual da **Morana Encorp**. \n\nEstou aqui para tirar suas dúvidas sobre nossos empreendimentos, financiamento e muito mais. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<number | null>(null);


  useEffect(() => {
    try {
      chatRef.current = createChatSession();
    } catch (e) {
      console.error("Failed to initialize chat:", e);
      setMessages(prev => [...prev, {
        id: generateId(),
        author: MessageAuthor.AI,
        text: "⚠️ **Aviso**: Não foi possível conectar ao serviço de IA. Verifique se a chave de API está configurada corretamente no ambiente."
      }]);
    }

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isAiTyping) return;

    // Try to re-initialize if it failed previously
    if (!chatRef.current) {
       try {
         chatRef.current = createChatSession();
       } catch (e) {
         setMessages(prev => [...prev, { 
           id: generateId(), 
           author: MessageAuthor.AI, 
           text: "Erro: Serviço de IA indisponível." 
         }]);
         return;
       }
    }

    const userMessage: Message = { id: generateId(), author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (chatRef.current) {
      const { text: aiResponseText, sources: aiResponseSources } = await sendMessageToAI(chatRef.current, input);
      setIsLoading(false);
      setIsAiTyping(true);
      
      const aiMessage: Message = { id: generateId(), author: MessageAuthor.AI, text: '', sources: aiResponseSources };
      setMessages(prev => [...prev, aiMessage]);

      let index = 0;
      typingIntervalRef.current = window.setInterval(() => {
        if (index < aiResponseText.length) {
          const currentText = aiResponseText.substring(0, index + 1);
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === aiMessage.id ? { ...msg, text: currentText } : msg
            )
          );
          index++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setIsAiTyping(false);
        }
      }, 15); // Faster typing speed
    } else {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (text: string) => {
    const rawMarkup = marked(text, { breaks: true, gfm: true });
    return { __html: rawMarkup };
  };
  
  const getHostname = (uri: string) => {
    try {
      return new URL(uri).hostname;
    } catch (e) {
      return uri;
    }
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-grow p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
            
            {msg.author === MessageAuthor.AI && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shadow-sm mt-1">
                <AiIcon className="w-5 h-5" />
              </div>
            )}
            
            <div className={`relative max-w-[85%] md:max-w-lg p-4 md:p-5 shadow-sm
              ${msg.author === MessageAuthor.USER 
                ? 'bg-red-700 text-white rounded-2xl rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'
              }`}
            >
              <div 
                className={`prose prose-sm md:prose-base max-w-none leading-relaxed ${msg.author === MessageAuthor.USER ? 'prose-invert' : 'prose-headings:text-gray-900 prose-a:text-red-700'}`} 
                dangerouslySetInnerHTML={parseMarkdown(msg.text)} 
              />
              
              {msg.sources && msg.sources.length > 0 && !isAiTyping && (
                <div className="mt-4 pt-3 border-t border-gray-300/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Fontes verificadas
                  </h4>
                  <ul className="space-y-1">
                    {msg.sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:underline truncate w-full"
                          title={source.title}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          {source.title && source.title.trim() !== getHostname(source.uri) ? source.title : getHostname(source.uri)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {msg.author === MessageAuthor.USER && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 border border-gray-300 text-gray-600 flex items-center justify-center shadow-sm mt-1">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4 justify-start animate-fadeInUp">
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shadow-sm">
               <AiIcon className="w-5 h-5" />
             </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-gray-100 border border-gray-100 flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 md:p-5 z-10">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta sobre a Morana Encorp..."
            className="w-full bg-gray-100 text-gray-800 rounded-full py-3.5 pl-6 pr-14 border border-transparent focus:border-red-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-inner"
            disabled={isLoading || isAiTyping}
          />
          <button
            type="submit"
            disabled={isLoading || isAiTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 hover:bg-red-800 text-white rounded-full p-2.5 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            aria-label="Enviar mensagem"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAgent;
