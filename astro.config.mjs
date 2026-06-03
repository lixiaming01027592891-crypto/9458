import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'fs';
import path from 'path';

/**
 * Custom sitemap integration using astro:build:done hook
 * Replaces @astrojs/sitemap which has compatibility issues with Astro 4.x
 */
function sitemap() {
  return {
    name: 'custom-sitemap',
    hooks: {
      'astro:build:done': ({ pages, dir }) => {
        const SITE = 'https://9458moving.net';
        
        // Filter out 404 page
        const validPages = pages.filter(p => p.pathname !== '404/');
        
        const today = new Date().toISOString().split('T')[0];
        
        const urlEntries = validPages.map(p => {
          const pagePath = p.pathname;
          const loc = `${SITE}/${pagePath}`;
          const priority = pagePath === '' ? '1.0'
            : pagePath === 'blog/' ? '0.9'
            : pagePath.startsWith('blog/') ? '0.7'
            : '0.8';
          const changefreq = pagePath.startsWith('blog/') ? 'monthly' : 'weekly';
          
          return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        }).join('\n');
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
        
        const outPath = new URL('sitemap.xml', dir);
        fs.writeFileSync(outPath, sitemap, 'utf-8');
        console.log(`sitemap.xml generated with ${validPages.length} URLs`);
      }
    }
  };
}

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://9458moving.net',
  output: 'static',
  build: {
    format: 'directory'
  }
});