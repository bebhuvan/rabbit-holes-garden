// Vercel serverless function for AI post generation
export default async function handler(req, res) {
  // Enable CORS for your Cloudflare Pages domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputType, content, settings, metadata } = req.body;

    // Validate input
    if (!content || !settings?.apiKey) {
      return res.status(400).json({
        error: 'Missing required fields: content and API key'
      });
    }

    // Generate post using AI
    const generatedPost = await generatePostWithAI({
      inputType,
      content,
      settings,
      metadata
    });

    return res.status(200).json({
      success: true,
      post: generatedPost
    });

  } catch (error) {
    console.error('Post generation error:', error);
    
    return res.status(500).json({
      error: error.message || 'Failed to generate post'
    });
  }
}

async function generatePostWithAI({ inputType, content, settings, metadata }) {
  const { provider, apiKey, model, temperature } = settings;

  // Prepare content based on input type
  let processedContent = content;
  
  if (inputType === 'url') {
    processedContent = await extractFromURL(content);
  }

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
${processedContent}

Remember to write in the distinctive "Rabbit Holes" voice and include proper markdown formatting with link-card divs for external references.`;

  // Call AI API based on provider
  if (provider === 'openai') {
    return await callOpenAI(systemPrompt, userPrompt, model, temperature, apiKey);
  } else if (provider === 'anthropic') {
    return await callAnthropic(systemPrompt, userPrompt, model, temperature, apiKey);
  }
  
  throw new Error('Unsupported AI provider');
}

async function callOpenAI(systemPrompt, userPrompt, model, temperature, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: temperature || 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return parseAIResponse(content);
}

async function callAnthropic(systemPrompt, userPrompt, model, temperature, apiKey) {
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
  const content = data.content[0].text;
  
  return parseAIResponse(content);
}

function parseAIResponse(response) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    return {
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.excerpt,
      tags: parsed.tags || [],
      suggestedDate: new Date(),
    };
  } catch {
    // Fallback: extract content manually
    const lines = response.split('\n');
    let title = 'Untitled Post';
    
    // Try to extract title from first heading
    const titleMatch = response.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }
    
    // Generate excerpt from first paragraph
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

async function extractFromURL(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic content extraction
    const content = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return content.substring(0, 5000); // Limit content
  } catch (error) {
    throw new Error(`Failed to extract content from URL: ${error.message}`);
  }
}