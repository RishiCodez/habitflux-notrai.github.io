
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { Send, User, Bot, Radio, ActivitySquare } from 'lucide-react';
import CustomButton from '../components/CustomButton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your productivity assistant. How can I help you today? I can help you manage tasks, schedule your time, or provide productivity tips.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini
      const response = await getGeminiResponse(input);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get assistant response:', error);
      toast.error('Failed to get assistant response. Please try again.');
      
      addFallbackResponse(input);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        throw new Error('Gemini API key is not configured');
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `As a productivity assistant, respond to: ${userInput}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Gemini response:', data);
      
      // Extract the text from the response
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };
  
  const addFallbackResponse = (userInput: string) => {
    setTimeout(() => {
      let responseContent = '';
      
      if (userInput.toLowerCase().includes('task') || userInput.toLowerCase().includes('todo')) {
        responseContent = "I can help you manage your tasks! Would you like me to add a new task, show your current tasks, or help you prioritize them?";
      } else if (userInput.toLowerCase().includes('schedule') || userInput.toLowerCase().includes('plan')) {
        responseContent = "I can help with scheduling! I recommend blocking time for deep work in the morning when your energy is high, and leaving administrative tasks for the afternoon.";
      } else if (userInput.toLowerCase().includes('focus') || userInput.toLowerCase().includes('concentrate')) {
        responseContent = "For better focus, try the Pomodoro technique - 25 minutes of deep work followed by a 5-minute break. Would you like me to set up a timer for you?";
      } else {
        responseContent = "I'm here to help with your productivity needs. You can ask me about task management, scheduling, focus techniques, or productivity tips!";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">AI Assistant</h1>
          
          <div className="text-sm mr-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
            Powered by Gemini
          </div>
        </div>
        
        <div className="flex-1 rounded-xl overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900/80 dark:via-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-lg">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex max-w-[80%]",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl p-4 shadow-md transition-all animate-fade-in",
                      message.sender === 'user'
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 dark:text-slate-100 text-foreground backdrop-blur-sm"
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {message.sender === 'user' ? (
                        <div className="p-1 bg-white/20 rounded-full">
                          <User className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="p-1 bg-primary/10 rounded-full">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <span className="font-medium text-sm">
                        {message.sender === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="py-2 px-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center text-sm">
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Thinking...</span>
              </div>
            )}
            
            {!isLoading && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span>Ready</span>
              </div>
            )}
            
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              Gemini connected
            </span>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 h-12 max-h-32 px-4 py-2 border border-indigo-100 dark:border-indigo-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none bg-white dark:bg-gray-800 dark:text-white shadow-sm"
                rows={1}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 h-12 w-12 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Type and press Enter to send, Shift+Enter for new line
              </p>
              {!import.meta.env.VITE_GEMINI_API_KEY && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="h-2 w-2 bg-red-500 rounded-full"></span> Gemini API key not configured
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AssistantPage;
