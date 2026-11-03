// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeAnchors from './scripts/rehype-anchors.mjs';
import { parseSummary } from './scripts/lib/summary.mjs';

const SITE_URL = process.env.SITE_URL || undefined;

const { groups } = parseSummary(readFileSync(new URL('../theme-docs/SUMMARY.md', import.meta.url), 'utf8'));

export default defineConfig({
  site: SITE_URL,
  markdown: { rehypePlugins: [rehypeAnchors] },
  integrations: [
    starlight({
      title: 'Universe docs',
      logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', alt: 'Developpy' },
      favicon: '/favicon.svg',
      head: [
        // Without SITE_URL the build is a preview copy: keep it out of search engines.
        ...(SITE_URL ? [] : [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }]),
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        // Figtree is the only webfont: preload it so the first paint is already on brand.
        {
          tag: 'link',
          attrs: { rel: 'preload', href: '/fonts/figtree-variable-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        },
      ],
      customCss: ['./src/styles/brand.css'],
      components: { Footer: './src/components/Footer.astro' },
      editLink: undefined,
      lastUpdated: false,
      pagination: true,
      sidebar: groups.map((group) => ({
        label: group.label,
        collapsed: true,
        items: group.pages.map((p) => ({ label: p.label, link: p.route })),
      })),
    }),
  ],
});
