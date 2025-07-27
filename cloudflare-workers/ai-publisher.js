// Cloudflare Worker for AI Publisher with multi-URL support
// Deploy this to Cloudflare Workers and update the WORKER_URL in your frontend

const AI_API_URL = 'https://api.openai.com/v1/chat/completions';

export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { urls, type = 'link-roundup' } = await request.json();
      
      if (!urls || !Array.isArray(urls) || urls.length === 0 || urls.length > 10) {
        return new Response(JSON.stringify({
          error: 'Please provide 1-10 URLs in the urls array'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Fetch content from all URLs
      const contentPromises = urls.map(async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; RabbitHolesBot/1.0)',
            },
            timeout: 10000,
          });
          
          if (!response.ok) {
            return { url, error: `HTTP ${response.status}` };
          }
          
          const html = await response.text();
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1] : 'Untitled';
          
          const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
          const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
          const description = (descMatch && descMatch[1]) || (ogDescMatch && ogDescMatch[1]) || '';
          
          // Extract main content (basic text extraction)
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          let content = bodyMatch ? bodyMatch[1] : html;
          content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
          content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
          content = content.replace(/<[^>]*>/g, ' ');
          content = content.replace(/\s+/g, ' ').trim();
          content = content.substring(0, 1500); // Limit content length
          
          return {
            url,
            title: title.trim(),
            description: description.trim(),
            content: content.substring(0, 500) + (content.length > 500 ? '...' : '')
          };
        } catch (error) {
          return { url, error: error.message };
        }
      });

      const results = await Promise.all(contentPromises);
      const successfulResults = results.filter(r => !r.error);
      const failedResults = results.filter(r => r.error);

      if (successfulResults.length === 0) {
        return new Response(JSON.stringify({
          error: 'Failed to fetch content from all URLs',
          details: failedResults
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Generate content using AI
      const prompt = type === 'link-roundup' 
        ? generateLinkRoundupPrompt(successfulResults)
        : generateSinglePostPrompt(successfulResults[0]);

      const aiResponse = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a thoughtful curator for "Rabbit Holes" - a blog about fascinating discoveries across the internet. Write engaging, curious content that makes readers want to explore deeper.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(`AI API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const generatedContent = aiData.choices && aiData.choices[0] && aiData.choices[0].message ? aiData.choices[0].message.content : null;

      if (!generatedContent) {
        throw new Error('No content generated from AI');
      }

      // Generate metadata
      const metadata = {
        title: extractTitle(generatedContent),
        excerpt: extractExcerpt(generatedContent),
        tags: generateTags(successfulResults),
        type: 'discovery',
        links: successfulResults.map(r => ({ url: r.url, title: r.title })),
        generatedAt: new Date().toISOString(),
        wordCount: generatedContent.split(/\s+/).length
      };

      // Store in KV if available
      if (env.POSTS_KV) {
        const postId = `post-${Date.now()}`;
        await env.POSTS_KV.put(postId, JSON.stringify({
          content: generatedContent,
          metadata,
          urls: successfulResults
        }));
      }

      return new Response(JSON.stringify({
        success: true,
        content: generatedContent,
        metadata,
        processedUrls: successfulResults.length,
        failedUrls: failedResults
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

function generateLinkRoundupPrompt(results) {
  const linksText = results.map(r => 
    `URL: ${r.url}\nTitle: ${r.title}\nDescription: ${r.description}\nContent: ${r.content}\n---`
  ).join('\n\n');

  return `Create an engaging link roundup post for these ${results.length} discoveries. Write it as a cohesive narrative that weaves together these finds, explaining why they're interesting and how they connect. Include:

1. A compelling title
2. An introduction that sets up the theme
3. Individual sections for each link with thoughtful commentary
4. A conclusion that ties everything together

Keep the tone curious, thoughtful, and engaging. Make it feel like a conversation with a curious friend.

Here are the links and content:

${linksText}`;
}

function generateSinglePostPrompt(result) {
  return `Create an engaging blog post about this discovery. Write it as someone who's genuinely excited to share this find. Include:

1. A compelling title
2. Why this discovery matters
3. Key insights or takeaways
4. Questions it raises or connections to other ideas

Keep the tone curious and engaging.

URL: ${result.url}
Title: ${result.title}
Description: ${result.description}
Content: ${result.content}`;
}

function extractTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'New Discovery';
}

function extractExcerpt(content) {
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const firstParagraph = lines[0] || '';
  return firstParagraph.length > 160 
    ? firstParagraph.substring(0, 157) + '...'
    : firstParagraph;
}

function generateTags(results) {
  const allText = results.map(r => `${r.title} ${r.description}`).join(' ').toLowerCase();
  const tags = [];
  
  // Simple keyword extraction
  const keywords = {
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'neural'],
    'design': ['design', 'ui', 'ux', 'interface', 'visual'],
    'technology': ['tech', 'software', 'programming', 'code'],
    'science': ['research', 'study', 'science', 'data'],
    'creativity': ['creative', 'art', 'artist', 'inspiration'],
    'productivity': ['productivity', 'tool', 'workflow', 'efficiency'],
    'culture': ['culture', 'society', 'social', 'human'],
    'business': ['business', 'startup', 'company', 'market']
  };
  
  for (const [tag, words] of Object.entries(keywords)) {
    if (words.some(word => allText.includes(word))) {
      tags.push(tag);
    }
  }
  
  return tags.length > 0 ? tags.slice(0, 4) : ['discovery'];
}