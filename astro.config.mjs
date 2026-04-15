// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
// Server output mode required for the /api/chat endpoint (AI chatbot)
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  build: {
    inlineStylesheets: 'auto'
  }
});
