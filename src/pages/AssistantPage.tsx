
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '../components/AppLayout';
import { Send, User, Bot, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import CustomButton from '../components/CustomButton';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('elevenLabsApiKey') || '');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize the conversation with correct handlers
  const conversation = useConversation({
    onMessage: (message) => {
      if (message.type === 'message' && message.role === 'assistant') {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: message.text || '',
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    },
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      toast.success('Connected to ElevenLabs voice assistant');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      if (apiKeySet) {
        toast.info('Disconnected from ElevenLabs voice assistant');
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      toast.error('Error with voice assistant. Please try again.');
    }
  });
  
  const { isSpeaking, status } = conversation;
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send message to ElevenLabs if connected
    if (status === 'connected') {
      try {
        // This will send the user's input to ElevenLabs for processing
        await conversation.sendTextMessage(input);
      } catch (error) {
        console.error('Failed to send message to ElevenLabs:', error);
        toast.error('Failed to send message to voice assistant');
        
        // Fallback to text-only response
        addFallbackResponse(input);
      }
    } else {
      // Fallback to text-only mode if voice is not connected
      addFallbackResponse(input);
    }
    
    setInput('');
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

  const handleConnect = async () => {
    if (!apiKey) {
      toast.error('Please enter your ElevenLabs API key');
      return;
    }

    try {
      // Set the API key globally for the ElevenLabs client
      // @ts-ignore - set API key method is available but might not be properly typed
      window.ElevenLabsClient = { apiKey };

      // Start the conversation session with the ElevenLabs agent
      await conversation.startSession({
        agentId: 'qfrPiYhFRt90nYpjvCue', // Public productivity assistant agent
        overrides: {
          tts: {
            voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah voice
          }
        }
      });
      
      setApiKeySet(true);
      
      // Set API key in localStorage for convenience
      localStorage.setItem('elevenLabsApiKey', apiKey);
      
      toast.success('Voice assistant connected!');
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect to ElevenLabs. Please check your API key.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await conversation.endSession();
      setApiKeySet(false);
      toast.info('Voice assistant disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect from voice assistant');
    }
  };
  
  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1.0 : 0.0 });
      setIsMuted(!isMuted);
      toast.info(isMuted ? 'Assistant unmuted' : 'Assistant muted');
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      toast.error('Failed to change volume settings');
    }
  };

  // Check for saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">AI Productivity Assistant</h1>
          
          {!apiKeySet && (
            <div className="flex gap-2 items-center">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter ElevenLabs API Key"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <Button 
                onClick={handleConnect} 
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Mic className="mr-2 h-4 w-4" />
                Connect Voice
              </Button>
            </div>
          )}
          
          {apiKeySet && (
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={toggleMute} 
                      variant="outline" 
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                onClick={handleDisconnect} 
                variant="secondary" 
                size="sm"
                className="flex items-center"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Disconnect Voice
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 rounded-xl overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900/80 dark:via-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-lg">
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
          
          {/* Speaking Indicator */}
          {isSpeaking && status === 'connected' && (
            <div className="py-2 px-4 bg-primary/10 text-center text-sm animate-pulse flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Assistant is speaking...</span>
            </div>
          )}
          
          {/* Status Indicator */}
          {status === 'connected' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-900/30 py-1">
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                Voice assistant connected
              </p>
            </div>
          )}
          
          {/* Input Field */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 h-12 max-h-32 px-4 py-2 border border-indigo-100 dark:border-indigo-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none bg-white dark:bg-gray-800 dark:text-white shadow-sm"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 h-12 w-12 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
              {status === 'connected' && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span> Voice connected
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
