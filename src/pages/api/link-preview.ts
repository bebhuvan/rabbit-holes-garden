import type { APIRoute } from 'astro';
import { fetchOpenGraphData } from '../../lib/link-preview';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const linkData = await fetchOpenGraphData(url);

    return new Response(JSON.stringify(linkData), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Link preview API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch link preview' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};