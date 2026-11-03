import { slugify } from './slugify.mjs';

// Parse theme-docs/SUMMARY.md into groups and a flat, ordered page list.
export function parseSummary(text) {
  const groups = [];
  const pages = [];
  const seen = new Map();
  let current = null;

  for (const line of text.split('\n')) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      const label = heading[1].trim();
      current = { label, slug: slugify(label), pages: [] };
      groups.push(current);
      continue;
    }
    const entry = line.match(/^\* \[(.+?)\]\((.+?)\)$/);
    if (!entry) continue;

    const [, label, file] = entry;
    const stem = file.split('/').pop().replace(/\.md$/, '');
    const isReadme = !current && file === 'README.md';
    const route = isReadme ? '/' : `/${current ? current.slug : ''}/${stem}/`;
    const page = { label, file, group: current ? current.label : null, route, stem };

    if (seen.has(route)) {
      throw new Error(`Route collision on ${route}: ${seen.get(route)} and ${file}`);
    }
    seen.set(route, file);
    pages.push(page);
    if (current) current.pages.push(page);
  }
  return { groups, pages };
}
