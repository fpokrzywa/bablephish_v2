interface OpenAIAssistant {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
  tools: any[];
  created_at: number;
  metadata: Record<string, any>;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isFavorite?: boolean;
  model?: string;
  instructions?: string;
  isCustom?: boolean;
}

class OpenAIService {
  private baseURL = '/api/openai';
  private cacheKey = 'openai_assistants_cache';
  private cacheTimestampKey = 'openai_assistants_cache_timestamp';
  private cacheExpiryMs = 5 * 60 * 1000; // 5 minutes

  // Cache management methods
  private getCachedAssistants(): OpenAIAssistant[] | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      const timestamp = localStorage.getItem(this.cacheTimestampKey);
      
      if (!cached || !timestamp) {
        return null;
      }

      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge > this.cacheExpiryMs) {
        this.clearCache();
        return null;
      }

      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  private setCachedAssistants(assistants: OpenAIAssistant[]) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(assistants));
      localStorage.setItem(this.cacheTimestampKey, Date.now().toString());
    } catch (error) {
      console.error('Failed to cache assistants:', error);
    }
  }

  private clearCache() {
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.cacheTimestampKey);
  }

  private isCacheFresh(): boolean {
    const timestamp = localStorage.getItem(this.cacheTimestampKey);
    if (!timestamp) return false;
    
    const cacheAge = Date.now() - parseInt(timestamp);
    return cacheAge < 60 * 1000; // 1 minute
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  getCachedAssistantsSync(): OpenAIAssistant[] {
    return this.getCachedAssistants() || [];
  }

  async listAssistants(forceRefresh: boolean = false): Promise<{
    assistants: OpenAIAssistant[];
    fromCache: boolean;
  }> {
    const cachedAssistants = this.getCachedAssistants();
    if (!forceRefresh && cachedAssistants && this.isCacheFresh()) {
      return { assistants: cachedAssistants, fromCache: true };
    }

    try {
      const data = await this.makeRequest('/assistants');
      const assistants = data.data || data.assistants || [];
      
      this.setCachedAssistants(assistants);
      return { assistants, fromCache: false };
    } catch (error) {
      console.error('Failed to fetch assistants:', error);
      return { 
        assistants: cachedAssistants || this.getFallbackAssistants(), 
        fromCache: true 
      };
    }
  }

  private getFallbackAssistants(): OpenAIAssistant[] {
    return [
      {
        id: 'it-support',
        name: 'IT Support',
        description: 'Your friendly IT support assistant',
        instructions: 'Help with IT support questions',
        model: 'gpt-4',
        tools: [],
        created_at: Date.now(),
        metadata: {}
      },
      {
        id: 'hr-support',
        name: 'HR Support',
        description: 'Human resources support assistant',
        instructions: 'Help with HR questions',
        model: 'gpt-4',
        tools: [],
        created_at: Date.now(),
        metadata: {}
      },
      {
        id: 'coding-assistant',
        name: 'Coding Assistant',
        description: 'Programming and code help',
        instructions: 'Help with programming questions',
        model: 'gpt-4',
        tools: [],
        created_at: Date.now(),
        metadata: {}
      }
    ];
  }

  formatAssistantForDisplay(openaiAssistant: OpenAIAssistant): Assistant {
    const getCompanyBotName = () => {
      try {
        const config = require('../company_config.json');
        return config[0]?.COMPANY_BOT_NAME || 'BablePhish Portal';
      } catch {
        return 'BablePhish Portal';
      }
    };
    
    const { icon, color } = this.generateIconAndColor(openaiAssistant);
    const isBablePhishPortal = openaiAssistant.name === getCompanyBotName();
    
    return {
      id: openaiAssistant.id,
      name: openaiAssistant.name || 'Unnamed Assistant',
      description: openaiAssistant.description || openaiAssistant.instructions?.substring(0, 100) + '...' || 'No description available',
      icon: isBablePhishPortal ? '/bablephish_logo.svg' : icon,
      color: isBablePhishPortal ? 'bg-gray-800 text-white' : color,
      model: openaiAssistant.model,
      instructions: openaiAssistant.instructions,
      isFavorite: false
    };
  }

  private generateIconAndColor(assistant: OpenAIAssistant): { icon: string; color: string } {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-yellow-100 text-yellow-600',
      'bg-red-100 text-red-600',
      'bg-indigo-100 text-indigo-600',
      'bg-pink-100 text-pink-600',
      'bg-blue-100 text-blue-600',
    ];

    const hash = assistant.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    return {
      icon: '🤖',
      color
    };
  }

  async sendMessage(assistantId: string, message: string): Promise<string> {
    try {
      const response = await this.makeRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]
        })
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Failed to send message:', error);
      return 'Sorry, I encountered an error processing your message.';
    }
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
