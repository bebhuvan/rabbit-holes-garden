import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  
  const searchData = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    excerpt: post.data.excerpt,
    tags: post.data.tags,
    date: post.data.date.toISOString(),
    author: post.data.author || 'Bhuvanesh'
  }));
  
  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
};