// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeAnchors from './scripts/rehype-anchors.mjs';
import { parseSummary } from './scripts/lib/summary.mjs';

const { groups } = parseSummary(readFileSync(new URL('../theme-docs/SUMMARY.md', import.meta.url), 'utf8'));

export default defineConfig({
  markdown: { rehypePlugins: [rehypeAnchors] },
  integrations: [
    starlight({
      title: 'Universe docs',
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
