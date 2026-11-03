import { slugify } from './lib/slugify.mjs';

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function walk(node) {
  if (node.type === 'element' && HEADINGS.has(node.tagName)) {
    node.properties ??= {};
    if (!node.properties.id) {
      const id = slugify(textOf(node));
      if (id) node.properties.id = id;
    }
  }
  for (const child of node.children ?? []) walk(child);
}

export default function rehypeAnchors() {
  return (tree) => walk(tree);
}
