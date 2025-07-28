// @ts-check
import { defineConfig } from 'astro/config';
import { remarkLinkPreview } from './src/plugins/remarkLinkPreview.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://rabbit-holes.bhuvanesh.com',
  markdown: {
    remarkPlugins: [remarkLinkPreview],
    extendDefaultPlugins: true
  }
});
