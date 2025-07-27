import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  
  if (posts.length === 0) {
    return new Response(JSON.stringify({ slug: null }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const randomIndex = Math.floor(Math.random() * posts.length);
  const randomPost = posts[randomIndex];

  return new Response(
    JSON.stringify({
      slug: randomPost.slug,
      title: randomPost.data.title,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}