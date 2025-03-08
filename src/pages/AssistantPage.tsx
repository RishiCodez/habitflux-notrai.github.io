
import React from 'react';
import AppLayout from '../components/AppLayout';

// Create a wrapper component for the ElevenLabs widget to fix TypeScript errors
const ElevenLabsConvai: React.FC = () => {
  React.useEffect(() => {
    // Dynamically load the ElevenLabs script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Use div with ref to mount the ElevenLabs widget
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="F0hJ2fffnyCQpia2K92E"></elevenlabs-convai>'
      }}
    />
  );
};

const AssistantPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Noya AI Assistant</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Main chatbot iframe */}
          <div className="flex-1 rounded-xl overflow-hidden border border-indigo-100 dark:border-indigo-900/40 shadow-lg h-full">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/NpxvZmmMBSotHDaU1x9dU"
              width="100%"
              style={{ height: '100%', minHeight: '700px' }}
              frameBorder="0"
              title="Noya AI Chatbot"
            ></iframe>
          </div>
          
          {/* ElevenLabs voice bubble */}
          <div className="w-full md:w-64 glass-card rounded-xl p-4 shadow-md">
            <h3 className="text-lg font-medium mb-2">Voice Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">Talk to Noya with your voice</p>
            
            <div className="w-full h-72 border rounded-lg overflow-hidden">
              <ElevenLabsConvai />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AssistantPage;
