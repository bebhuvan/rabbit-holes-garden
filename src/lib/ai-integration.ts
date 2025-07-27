// AI Integration for Rabbit Holes
// This module handles AI-powered post generation from various sources

export interface AIInput {
  type: 'link' | 'text' | 'pdf' | 'file';
  content: string;
  metadata?: {
    title?: string;
    url?: string;
    source?: string;
  };
}

export interface GeneratedPost {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  suggestedDate?: Date;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  temperature?: number;
}

// System prompt for generating thoughtful posts
const SYSTEM_PROMPT = `
You are an expert content curator and writer for "Rabbit Holes", a blog that discovers and shares beautiful, thought-provoking things from across the internet.

Your writing style is:
- Thoughtful and contemplative
- Intellectually curious
- Connects ideas across disciplines
- Elegant and accessible
- Uses evocative metaphors
- Finds beauty in unexpected places

When given content to analyze, create a blog post that:
1. Identifies the most interesting insights
2. Adds meaningful context and connections
3. Uses the signature "Rabbit Holes" voice
4. Includes relevant quotes when appropriate
5. Suggests related ideas or broader implications

Format your response as JSON with:
- title: Compelling, specific title
- content: Full blog post in markdown format
- excerpt: 1-2 sentence summary
- tags: 2-4 relevant tags
- suggestedDate: Current date in ISO format
`;

export class AIPostGenerator {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generatePost(input: AIInput): Promise<GeneratedPost> {
    const prompt = this.buildPrompt(input);
    
    try {
      const response = await this.callAI(prompt);
      return this.parseResponse(response);
    } catch (error) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private buildPrompt(input: AIInput): string {
    let prompt = `Please analyze the following ${input.type} and create a thoughtful blog post:\n\n`;
    
    if (input.metadata?.title) {
      prompt += `Title: ${input.metadata.title}\n`;
    }
    if (input.metadata?.url) {
      prompt += `URL: ${input.metadata.url}\n`;
    }
    if (input.metadata?.source) {
      prompt += `Source: ${input.metadata.source}\n`;
    }
    
    prompt += `\nContent:\n${input.content}\n\n`;
    prompt += `Remember to write in the distinctive "Rabbit Holes" voice - thoughtful, curious, and connecting ideas across disciplines.`;
    
    return prompt;
  }

  private async callAI(prompt: string): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else if (this.config.provider === 'anthropic') {
      return this.callAnthropic(prompt);
    }
    throw new Error('Unsupported AI provider');
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: this.config.temperature || 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: this.config.temperature || 0.7,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private parseResponse(response: string): GeneratedPost {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return {
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        tags: parsed.tags || [],
        suggestedDate: parsed.suggestedDate ? new Date(parsed.suggestedDate) : new Date(),
      };
    } catch {
      // Fallback: extract content manually
      return this.extractFromPlainText(response);
    }
  }

  private extractFromPlainText(response: string): GeneratedPost {
    // Simple extraction for non-JSON responses
    const lines = response.split('\n');
    let title = '';
    let content = response;
    
    // Try to extract title from first heading
    const titleMatch = response.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
    
    // Generate excerpt from first paragraph
    const paragraphs = response.split('\n\n');
    const excerpt = paragraphs.find(p => p.length > 50 && !p.startsWith('#'))?.substring(0, 150) + '...' || '';
    
    return {
      title: title || 'Untitled Post',
      content,
      excerpt,
      tags: ['ai-generated'],
      suggestedDate: new Date(),
    };
  }
}

// Content extractors for different input types
export class ContentExtractor {
  static async extractFromURL(url: string): Promise<AIInput> {
    try {
      // Simple fetch for now - in production, you'd want a more robust solution
      const response = await fetch(url);
      const html = await response.text();
      
      // Basic content extraction (you'd want a proper library like Readability.js)
      const content = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || '';
      
      return {
        type: 'link',
        content: content.substring(0, 5000), // Limit content
        metadata: {
          title,
          url,
          source: new URL(url).hostname,
        }
      };
    } catch (error) {
      throw new Error(`Failed to extract content from URL: ${error.message}`);
    }
  }

  static async extractFromPDF(file: File): Promise<AIInput> {
    // For PDF extraction, you'd typically use a library like pdf-parse
    // This is a placeholder implementation
    return {
      type: 'pdf',
      content: 'PDF content would be extracted here',
      metadata: {
        title: file.name,
        source: 'PDF Upload',
      }
    };
  }

  static async extractFromText(text: string, title?: string): Promise<AIInput> {
    return {
      type: 'text',
      content: text,
      metadata: {
        title: title || 'Text Input',
        source: 'Direct Input',
      }
    };
  }
}

// Utility function to save generated posts
export async function saveGeneratedPost(post: GeneratedPost): Promise<string> {
  const slug = post.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const frontmatter = `---
title: "${post.title}"
date: ${(post.suggestedDate || new Date()).toISOString().split('T')[0]}
excerpt: "${post.excerpt}"
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
---

${post.content}`;

  // In a real implementation, you'd save this to your content directory
  // For now, we'll return the formatted content
  return frontmatter;
}