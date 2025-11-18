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

// FAQ questions from ALL sections in /learn/faq
// Mix questions from "How Hobson works", "Getting the best out of Hobson", and "Hobson Credits"
const FAQ_QUESTIONS = [
  // How Hobson works
  { full: "How are units, groups, portfolios, and documents arranged in Hobson?", short: "Organization?" },
  { full: "Which file types are supported?", short: "File types?" },
  { full: "What types of documents can Hobson read?", short: "Doc types?" },
  { full: "How to get documents to Hobson", short: "Upload docs?" },
  { full: "Does Hobson work on mobile?", short: "Mobile?" },
  { full: "Who owns the data and outputs?", short: "Data ownership?" },
  { full: "How does Hobson use OpenAI?", short: "OpenAI usage?" },
  { full: "Does OpenAI store my documents?", short: "Storage?" },
  { full: "Does OpenAI use my data to train their models?", short: "Training?" },
  { full: "What data does Hobson send to OpenAI?", short: "Data sent?" },
  { full: "Where are my documents actually stored?", short: "Storage?" },
  { full: "Why does Hobson need to send anything to OpenAI at all?", short: "Why OpenAI?" },
  { full: "Who can see my documents?", short: "Access?" },
  { full: "How does Hobson protect my data when using OpenAI?", short: "Protection?" },
  { full: "Does OpenAI know who I am or hold details of my property holdings?", short: "Privacy?" },
  { full: "What happens technically when a document is uploaded?", short: "Upload process?" },
  { full: "What happens when I ask a question?", short: "Question process?" },
  // Getting the best out of Hobson
  { full: "How long does Hobson take to read a document?", short: "Processing time?" },
  { full: "Can Hobson be trained on my company's information?", short: "Training?" },
  { full: "Can I add a unit manually without uploading a document?", short: "Manual units?" },
  { full: "Which level should I use when asking a question?", short: "Question levels?" },
  { full: "What should I do if I get a poor answer?", short: "Poor answers?" },
  { full: "How should I structure my prompts for the best results?", short: "Prompt tips?" },
  { full: "Can Hobson connect to our systems?", short: "Integrations?" },
  { full: "Can I control who has access?", short: "Access control?" },
  // Hobson Credits
  { full: "What is a HEU?", short: "HEU?" },
  { full: "How much do different tasks cost in HEUs?", short: "HEU costs?" },
  { full: "How can I upgrade my subscription?", short: "Upgrade?" },
  { full: "How can I downgrade my subscription?", short: "Downgrade?" },
  { full: "How can I cancel my subscription?", short: "Cancel?" },
  { full: "How can I change my billing information?", short: "Billing?" },
  { full: "How do I download my invoices?", short: "Invoices?" },
  { full: "How do I get more credits?", short: "More credits?" },
  { full: "When does my credit limit reset?", short: "Credit reset?" },
  { full: "How do I see the remaining credits in a workspace?", short: "Check credits?" },
  { full: "Can I get free credits?", short: "Free credits?" },
];

// Get 2 random FAQ questions for initial display
const getRandomQuickQuestions = () => {
  const shuffled = [...FAQ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

const getRandomFollowUpQuestion = () => {
  const randomIndex = Math.floor(Math.random() * FAQ_QUESTIONS.length);
  return FAQ_QUESTIONS[randomIndex].full;
};

export function HobsonChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<Array<{full: string, short: string}>>([]);
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
        content: "Hey there! What would you like to know about?"
      };
      setMessages([welcomeMessage]);
      setQuickQuestions(getRandomQuickQuestions());
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
      content: "Hey there! What would you like to know about?"
    };
    setMessages([welcomeMessage]);
    setQuickQuestions(getRandomQuickQuestions()); // Refresh questions on clear
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
                <div key={index}>
                  <div
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
                  
                  {/* Quick Questions - show after welcome message */}
                  {message.role === 'assistant' && index === 0 && messages.length === 1 && quickQuestions.length > 0 && !isLoading && (
                    <div className="flex flex-col gap-2 mt-3">
                      {quickQuestions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleQuickQuestion(question.full)}
                          className="text-sm px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-left"
                        >
                          {question.full}
                        </button>
                      ))}
                    </div>
                  )}
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

            {/* Follow-up Questions - show after answers */}
            {followUpQuestions.length > 0 && !isLoading && messages.length > 1 && (
              <div className="px-4 pb-2 flex flex-col gap-2">
                {followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-sm px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-left"
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
