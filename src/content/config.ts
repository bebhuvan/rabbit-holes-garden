import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    source: z.string().optional(),
    discovery_context: z.string().optional(),
    post_type: z.enum(['discovery', 'thought', 'link', 'observation']),
    author: z.string().optional(),
    link: z.string().optional(),
    embeds: z.array(z.object({
      url: z.string(),
      type: z.enum(['youtube', 'twitter', 'codepen', 'gist'])
    })).optional()
  })
});

export const collections = { posts };