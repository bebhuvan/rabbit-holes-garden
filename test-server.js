// Simple test server for the API function
import { config } from 'dotenv';
import { createServer } from 'http';
import { URL } from 'url';

config();

// Import the API function (simulate the Vercel environment)
async function generatePostWithAI({ inputType, content, settings, metadata }) {
  const { provider, apiKey, model, temperature } = settings;

  // System prompt for generating thoughtful posts
  const systemPrompt = `You are an expert content curator and writer for "Rabbit Holes", a blog that discovers and shares beautiful, thought-provoking things from across the internet.

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

Format your response as valid JSON ONLY with:
- title: Compelling, specific title
- content: Full blog post in markdown format (use \\n for line breaks, escape quotes properly)
- excerpt: 1-2 sentence summary  
- tags: Array of 2-4 relevant tags

IMPORTANT: Return ONLY valid JSON with properly escaped strings. No markdown code blocks or extra text.`;

  const userPrompt = `Please analyze the following ${inputType} and create a thoughtful blog post:

${metadata?.title ? `Title: ${metadata.title}\n` : ''}
${metadata?.url ? `URL: ${metadata.url}\n` : ''}

Content:
${content}

Remember to write in the distinctive "Rabbit Holes" voice and return only valid JSON.`;

  // Call Anthropic API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: temperature || 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content_response = data.content[0].text;
  
  return parseAIResponse(content_response);
}

function parseAIResponse(response) {
  try {
    // Clean up the response
    let cleaned = response.trim();
    
    // Remove any markdown code blocks if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.excerpt,
      tags: parsed.tags || [],
      suggestedDate: new Date(),
    };
  } catch (error) {
    console.error('JSON parsing failed:', error.message);
    console.log('Raw response:', response);
    
    // Fallback: extract content manually
    const lines = response.split('\n');
    let title = 'Untitled Post';
    
    const titleMatch = response.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
    
    const paragraphs = response.split('\n\n');
    const excerpt = paragraphs.find(p => p.length > 50 && !p.startsWith('#'))?.substring(0, 150) + '...' || '';
    
    return {
      title,
      content: response,
      excerpt,
      tags: ['ai-generated'],
      suggestedDate: new Date(),
    };
  }
}

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`${req.method} ${req.url}`);
  
  if (req.url === '/api/generate-post' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const { inputType, content, settings, metadata } = data;

          if (!content || !settings?.apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields' }));
            return;
          }

          console.log('🤖 Generating post for:', inputType, content.substring(0, 100) + '...');
          
          const generatedPost = await generatePostWithAI({
            inputType,
            content,
            settings,
            metadata
          });

          console.log('✅ Post generated:', generatedPost.title);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            post: generatedPost
          }));

        } catch (error) {
          console.error('❌ Generation error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.url === '/api/generate-post' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'AI Post Generator API',
      status: 'running',
      endpoint: '/api/generate-post (POST)'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Not found',
      available: '/api/generate-post',
      method: 'POST' 
    }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Test API server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/generate-post`);
});