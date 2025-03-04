
/**
 * Utility functions for working with ElevenLabs voice API
 */

// Default voices with their IDs
export const ELEVEN_LABS_VOICES = {
  ARIA: '9BWtsMINqrJLrRacOk9x',
  ROGER: 'CwhRBWXzGAHq8TQ4Fs17',
  SARAH: 'EXAVITQu4vr4xnSDxMaL',
  LAURA: 'FGY2WhTYpPnrIDTdsKH5',
  CHARLIE: 'IKne3meq5aSn9XLyUdCD',
  GEORGE: 'JBFqnCBsd6RMkjVDRZzb',
};

// ElevenLabs models
export const ELEVEN_LABS_MODELS = {
  MULTILINGUAL_V2: 'eleven_multilingual_v2',
  TURBO_V2: 'eleven_turbo_v2',
};

// Helper to validate an API key against ElevenLabs API
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating ElevenLabs API key:', error);
    return false;
  }
};

// In a production app, this would be a server-side function
// For this example, we're using a simplified approach
export const getPublicAgentId = (): string => {
  // This would normally be retrieved from your ElevenLabs account
  return 'qfrPiYhFRt90nYpjvCue'; // Example ID - replace with your actual agent ID
};
