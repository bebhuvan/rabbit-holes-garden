# Rabbit Holes AI Publisher

Cloudflare Worker for generating AI-powered content from URLs, supporting up to 10 URLs for link roundups.

## Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create KV namespace:
   ```bash
   wrangler kv:namespace create "POSTS_KV"
   wrangler kv:namespace create "POSTS_KV" --preview
   ```

4. Update `wrangler.toml` with your KV namespace IDs

5. Set environment variables in Cloudflare dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

6. Deploy:
   ```bash
   wrangler deploy
   ```

## Usage

Send POST request to your worker URL:

```javascript
// Single URL
const response = await fetch('https://your-worker.your-subdomain.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    urls: ['https://example.com/article'],
    type: 'single-post'
  })
});

// Link roundup (2-10 URLs)
const response = await fetch('https://your-worker.your-subdomain.workers.dev', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    urls: [
      'https://example.com/article1',
      'https://example.com/article2',
      'https://example.com/article3'
    ],
    type: 'link-roundup'
  })
});

const data = await response.json();
console.log(data.content); // Generated markdown content
console.log(data.metadata); // Title, excerpt, tags, etc.
```

## Response Format

```json
{
  "success": true,
  "content": "# Generated Post Title\n\nGenerated content...",
  "metadata": {
    "title": "Generated Post Title",
    "excerpt": "First paragraph excerpt...",
    "tags": ["ai", "technology"],
    "type": "discovery",
    "links": [{"url": "...", "title": "..."}],
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "wordCount": 250
  },
  "processedUrls": 3,
  "failedUrls": []
}
```

## Features

- Fetches content from 1-10 URLs
- Extracts title, description, and main content
- Generates cohesive posts using GPT-4
- Supports both single posts and link roundups
- Stores generated content in KV storage
- Automatic tag generation
- CORS support for frontend integration