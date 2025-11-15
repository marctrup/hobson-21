import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_URL = 'https://awfyhgeflakjhxtntokd.supabase.co';
const CHAT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/hobson-chat`;

const OWL_CHAT_BUBBLE = '/lovable-uploads/owl-chat-bubble.png';

const FOLLOW_UP_QUESTIONS = [
  "What can Hobson AI do?",
  "Tell me about pricing plans",
  "How does document processing work?",
  "What integrations are available?",
  "Show me use cases"
];

const getRandomFollowUpQuestion = () => {
  const randomIndex = Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.length);
  return FOLLOW_UP_QUESTIONS[randomIndex];
};

export function HobsonChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: "Hi! I'm Hobson, your AI assistant. I can help you learn about Hobson AI's features, pricing, and use cases. What would you like to know?"
      };
      setMessages([welcomeMessage]);
      setFollowUpQuestions([getRandomFollowUpQuestion(), getRandomFollowUpQuestion()]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleQuickQuestion = (question: string) => {
    sendMessageWithText(question);
  };

  const sendMessageWithText = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setFollowUpQuestions([]);

    try {
      const response = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
      setFollowUpQuestions([getRandomFollowUpQuestion(), getRandomFollowUpQuestion()]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithText(input);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setFollowUpQuestions([]);
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm Hobson, your AI assistant. I can help you learn about Hobson AI's features, pricing, and use cases. What would you like to know?"
    };
    setMessages([welcomeMessage]);
    setFollowUpQuestions([getRandomFollowUpQuestion(), getRandomFollowUpQuestion()]);
  };

  const renderMessage = (message: Message) => {
    return (
      <ReactMarkdown
        components={{
          a: ({ node, href, children, ...props }) => {
            const isInternal = href?.startsWith('/');
            if (isInternal) {
              return (
                <a
                  href={href}
                  className="text-primary hover:underline font-medium"
                  {...props}
                >
                  {children}
                </a>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
                {...props}
              >
                {children}
              </a>
            );
          },
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9998] group transition-transform hover:scale-105"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        <img 
          src={OWL_CHAT_BUBBLE}
          alt="Chat with Hobson" 
          style={{
            width: '81px',
            height: '81px',
            filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))'
          }}
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-end justify-end p-4 sm:p-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl flex flex-col w-full h-full sm:h-[600px] sm:w-[400px] sm:max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Hobson AI Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Clear chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {renderMessage(message)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {followUpQuestions.length > 0 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Initialize widget when loaded
if (typeof window !== 'undefined') {
  window.HobsonChatWidget = {
    init: (containerId: string = 'hobson-chat-widget') => {
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
      }
      
      const root = ReactDOM.createRoot(container);
      root.render(<HobsonChatWidget />);
    }
  };
}

declare global {
  interface Window {
    HobsonChatWidget: {
      init: (containerId?: string) => void;
    };
  }
}
