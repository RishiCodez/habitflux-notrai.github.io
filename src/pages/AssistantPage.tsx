
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { Send, User, Bot } from 'lucide-react';
import CustomButton from '../components/CustomButton';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate assistant response (in a real app, this would be an API call)
    setTimeout(() => {
      let responseContent = '';
      
      if (input.toLowerCase().includes('task') || input.toLowerCase().includes('todo')) {
        responseContent = "I can help you manage your tasks! Would you like me to add a new task, show your current tasks, or help you prioritize them?";
      } else if (input.toLowerCase().includes('schedule') || input.toLowerCase().includes('plan')) {
        responseContent = "I can help with scheduling! I recommend blocking time for deep work in the morning when your energy is high, and leaving administrative tasks for the afternoon.";
      } else if (input.toLowerCase().includes('focus') || input.toLowerCase().includes('concentrate')) {
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
        <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
        
        <div className="flex-1 glass-card rounded-xl overflow-hidden flex flex-col">
          {/* Chat Messages */}
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
                      "rounded-xl p-4",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {message.sender === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Field */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 h-12 max-h-32 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={1}
              />
              <CustomButton onClick={handleSendMessage} disabled={!input.trim()}>
                <Send className="h-5 w-5" />
              </CustomButton>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AssistantPage;
