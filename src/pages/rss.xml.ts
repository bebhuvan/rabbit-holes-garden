import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  return rss({
    title: 'Rabbit Holes - Discover. Dive deep. Get lost in beautiful distractions.',
    description: 'A curated collection of beautiful discoveries from across the internet—a space where curiosity leads to genuine understanding rather than quick consumption.',
    site: site || 'https://rabbitholes.garden',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      author: post.data.author || 'Bhuvanesh',
      link: `/posts/${post.slug}/`,
      guid: `/posts/${post.slug}/`,
      categories: post.data.tags,
      customData: post.data.link ? `<link>${post.data.link}</link>` : '',
    })),
    customData: `
      <language>en-us</language>
      <managingEditor>hello@rabbitholes.garden (Bhuvanesh)</managingEditor>
      <webMaster>hello@rabbitholes.garden (Bhuvanesh)</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} Rabbit Holes</copyright>
      <category>Technology</category>
      <category>Culture</category>
      <category>Science</category>
      <category>Art</category>
      <category>Philosophy</category>
      <ttl>60</ttl>
      <image>
        <url>https://rabbitholes.garden/icon-192x192.png</url>
        <title>Rabbit Holes</title>
        <link>https://rabbitholes.garden</link>
        <description>Rabbit Holes RSS Feed</description>
        <width>192</width>
        <height>192</height>
      </image>
    `,
    stylesheet: '/rss-styles.xsl',
  });
};