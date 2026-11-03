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
      // Light only: one Dark Violet logo, no dark variant.
      logo: { src: './src/assets/logo.svg', alt: 'Developpy' },
      favicon: '/favicon.svg',
      head: [
        // Without SITE_URL the build is a preview copy: keep it out of search engines.
        ...(SITE_URL ? [] : [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }]),
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        // Light only: tell the browser not to apply its dark UI (scrollbars, form controls, address bar).
        { tag: 'meta', attrs: { name: 'color-scheme', content: 'light' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#ffffff' } },
        // Figtree is the only webfont: preload it so the first paint is already on brand.
        {
          tag: 'link',
          attrs: { rel: 'preload', href: '/fonts/figtree-variable-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        },
      ],
      customCss: ['./src/styles/brand.css'],
      components: {
        Footer: './src/components/Footer.astro',
        // Light only: force data-theme="light" and drop the theme toggle.
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
      },
      // Light only: code blocks ship a single light theme instead of a dark and light pair.
      expressiveCode: {
        themes: ['starlight-light'],
        // Code blocks as brand cards: surface ground, hairline rule, media radius, no shadow.
        styleOverrides: {
          borderRadius: '14px',
          borderColor: 'rgb(17 11 47 / 0.12)',
          codeBackground: '#f4f3fe',
          frames: { frameBoxShadowCssValue: 'none' },
        },
      },
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
