import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageAuthor } from '../types';
import { createChatSession, sendMessageToAI } from '../services/geminiService';
import { Chat } from '@google/genai';
import { marked } from 'marked';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const AiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m14 16.2-2 2.1-2-2.1"></path></svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
);


const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { author: MessageAuthor.AI, text: "Olá! Sou o assistente virtual da Morana Encorp. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (chatRef.current) {
      const { text: aiResponseText, sources: aiResponseSources } = await sendMessageToAI(chatRef.current, input);
      const aiMessage: Message = { author: MessageAuthor.AI, text: aiResponseText, sources: aiResponseSources };
      setMessages(prev => [...prev, aiMessage]);
    }
    
    setIsLoading(false);
  };

  const parseMarkdown = (text: string) => {
    // FIX: The 'sanitize' option is deprecated and has been removed from recent versions of 'marked'.
    // This removes the unsupported option to fix the compilation error.
    const rawMarkup = marked(text);
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
    <div className="flex flex-col flex-grow bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="flex-grow p-4 md:p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}>
            {msg.author === MessageAuthor.AI && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center"><AiIcon className="w-5 h-5" /></div>}
            <div className={`max-w-md md:max-w-lg p-3 rounded-lg shadow ${msg.author === MessageAuthor.USER ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <h4 className="text-xs font-semibold text-gray-400 mb-2">Fontes:</h4>
                  <ul className="space-y-1.5">
                    {msg.sources.map((source, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-400 hover:underline truncate"
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
             {msg.author === MessageAuthor.USER && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center"><AiIcon className="w-5 h-5" /></div>
            <div className="max-w-xs p-3 rounded-lg shadow bg-gray-700 flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-0"></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
            className="flex-grow bg-gray-700 rounded-full py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAgent;