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


const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: crypto.randomUUID(), author: MessageAuthor.AI, text: "Olá! Sou o assistente virtual da Morana Encorp. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<number | null>(null);


  useEffect(() => {
    chatRef.current = createChatSession();

    // Cleanup function to clear interval when component unmounts
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

    const userMessage: Message = { id: crypto.randomUUID(), author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (chatRef.current) {
      const { text: aiResponseText, sources: aiResponseSources } = await sendMessageToAI(chatRef.current, input);
      setIsLoading(false);
      setIsAiTyping(true);
      
      const aiMessage: Message = { id: crypto.randomUUID(), author: MessageAuthor.AI, text: '', sources: aiResponseSources };
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
      }, 20); // Typing speed in ms
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
    <div className="flex flex-col flex-grow bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex-grow p-4 md:p-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
            {msg.author === MessageAuthor.AI && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><AiIcon className="w-5 h-5" /></div>}
            <div className={`max-w-md md:max-w-lg p-3 rounded-lg shadow-sm ${msg.author === MessageAuthor.USER ? 'bg-red-700 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
              <div className={`prose prose-sm max-w-none ${msg.author === MessageAuthor.USER ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
              {msg.sources && msg.sources.length > 0 && !isAiTyping && (
                <div className="mt-4 pt-3 border-t border-gray-300/70">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Fontes:</h4>
                  <ul className="space-y-1.5">
                    {msg.sources.map((source, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline truncate"
                          title={source.title}
                        >
                          {source.title && source.title.trim() !== getHostname(source.uri) ? source.title : getHostname(source.uri)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
             {msg.author === MessageAuthor.USER && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-fadeInUp">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><AiIcon className="w-5 h-5" /></div>
            <div className="max-w-xs p-3 rounded-lg shadow-sm bg-gray-200 flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-0"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-150"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow"
            disabled={isLoading || isAiTyping}
          />
          <button
            type="submit"
            disabled={isLoading || isAiTyping || !input.trim()}
            className="bg-red-700 hover:bg-red-800 text-white rounded-full p-3 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-white"
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