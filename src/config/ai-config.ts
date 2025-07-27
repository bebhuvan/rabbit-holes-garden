// AI Configuration for Rabbit Holes
// Store your API keys in environment variables for security

export const AI_CONFIG = {
  // Default settings
  defaultProvider: 'openai' as const,
  defaultModel: {
    openai: 'gpt-4',
    anthropic: 'claude-3-sonnet-20240229',
  },
  defaultTemperature: 0.7,
  
  // API endpoints
  endpoints: {
    openai: 'https://api.openai.com/v1/chat/completions',
    anthropic: 'https://api.anthropic.com/v1/messages',
  },
  
  // Content limits
  maxContentLength: 5000,
  maxTokens: 2000,
  
  // Supported file types
  supportedFileTypes: ['.pdf', '.txt', '.doc', '.docx', '.md'],
  
  // Rate limiting (requests per minute)
  rateLimit: {
    openai: 60,
    anthropic: 50,
  }
};

// Environment variable helpers
export const getAPIKey = (provider: 'openai' | 'anthropic'): string => {
  const key = provider === 'openai' 
    ? process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY
    : process.env.ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY;
    
  if (!key) {
    throw new Error(`${provider.toUpperCase()} API key not found in environment variables`);
  }
  
  return key;
};

// Validation helpers
export const validateInput = (content: string, type: string): boolean => {
  if (!content || content.trim().length === 0) {
    return false;
  }
  
  if (content.length > AI_CONFIG.maxContentLength) {
    throw new Error(`Content too long. Max length: ${AI_CONFIG.maxContentLength} characters`);
  }
  
  return true;
};

export const sanitizeInput = (content: string): string => {
  // Basic sanitization - remove potentially harmful content
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
};