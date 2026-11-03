import { slugify } from './slugify.mjs';

// Parse theme-docs/SUMMARY.md into groups and a flat, ordered page list.
export function parseSummary(text) {
  const groups = [];
  const pages = [];
  const seen = new Map();
  let current = null;

  for (const line of text.split('\n')) {
    if (line.trim() === '' || /^# /.test(line)) continue;
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      const label = heading[1].trim();
      if (slugify(label) === '') {
        throw new Error(`SUMMARY group label "${label}" slugifies to an empty string`);
      }
      current = { label, slug: slugify(label), pages: [] };
      groups.push(current);
      continue;
    }
    const entry = line.match(/^\* \[(.+?)\]\((.+?)\)$/);
    if (!entry) {
      throw new Error(`Unsupported SUMMARY line (nested pages are not supported): "${line}"`);
    }

    const [, label, file] = entry;
    const stem = file.split('/').pop().replace(/\.md$/, '');
    if (!current && file !== 'README.md') {
      throw new Error(`SUMMARY entry before the first "## " group must be README.md: "${line}"`);
    }
    if (current && stem !== slugify(stem)) {
      throw new Error(`SUMMARY page stem "${stem}" (${file}) is not slug-safe, expected "${slugify(stem)}"`);
    }
    const isReadme = !current;
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
