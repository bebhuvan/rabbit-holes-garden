import type { APIRoute } from 'astro';
import { AIPostGenerator, ContentExtractor, saveGeneratedPost } from '../../lib/ai-integration';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { inputType, content, settings, metadata } = data;

    // Validate input
    if (!content || !settings?.apiKey) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: content and API key'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize AI generator
    const generator = new AIPostGenerator({
      provider: settings.provider || 'openai',
      apiKey: settings.apiKey,
      model: settings.model,
      temperature: settings.temperature || 0.7,
    });

    // Prepare input based on type
    let aiInput;
    
    switch (inputType) {
      case 'url':
        aiInput = await ContentExtractor.extractFromURL(content);
        break;
      case 'text':
        aiInput = await ContentExtractor.extractFromText(content, metadata?.title);
        break;
      case 'file':
        // Handle file upload (would need multipart form data in real implementation)
        aiInput = {
          type: 'file',
          content: content,
          metadata: metadata,
        };
        break;
      default:
        return new Response(JSON.stringify({
          error: 'Invalid input type'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Generate post
    const generatedPost = await generator.generatePost(aiInput);

    return new Response(JSON.stringify({
      success: true,
      post: generatedPost
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Post generation error:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to generate post'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'AI Post Generator API',
    methods: ['POST'],
    requiredFields: ['inputType', 'content', 'settings']
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};