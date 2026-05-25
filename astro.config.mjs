import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://9458moving.com',
  output: 'static',
  build: {
    format: 'directory'
  }
});