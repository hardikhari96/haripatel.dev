// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Server output mode required for the /api/chat endpoint (AI chatbot)
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  build: {
    inlineStylesheets: 'auto'
  }
});
