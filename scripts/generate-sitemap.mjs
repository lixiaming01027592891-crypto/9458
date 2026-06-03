import fs from 'fs';
import path from 'path';

const SITE = 'https://9458moving.net';
const DIST_DIR = './dist';
const OUT_FILE = './dist/sitemap.xml';

function findHtmlFiles(dir, basePath = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(fullPath, relativePath));
    } else if (entry.name === 'index.html') {
      const urlPath = basePath ? `/${basePath}/` : '/';
      files.push(urlPath);
    }
  }

  return files;
}

function generateSitemap() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ directory not found. Run build first.');
    process.exit(1);
  }

  const pages = findHtmlFiles(DIST_DIR);

  // Filter out 404
  const validPages = pages.filter(p => p !== '/404/');

  const today = new Date().toISOString().split('T')[0];

  const urlEntries = validPages.map(pagePath => {
    const loc = `${SITE}${pagePath}`;
    const priority = pagePath === '/' ? '1.0'
      : pagePath === '/blog/' ? '0.9'
      : pagePath.startsWith('/blog/') ? '0.7'
      : '0.8';
    const changefreq = pagePath.startsWith('/blog/') ? 'monthly' : 'weekly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(OUT_FILE, sitemap, 'utf-8');
  console.log(`sitemap.xml generated with ${validPages.length} URLs`);
  validPages.forEach(p => console.log(`  - ${p}`));
}

generateSitemap();
