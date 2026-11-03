import type { APIRoute } from 'astro';

// Static endpoint, rendered once at build time. Without SITE_URL the build is a
// preview or staging copy and must stay out of search engines.
export const GET: APIRoute = () => {
  const siteUrl = process.env.SITE_URL;
  const body = siteUrl
    ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl.replace(/\/+$/, '')}/sitemap-index.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
