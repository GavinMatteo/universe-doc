import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformPage } from '../scripts/lib/transform.mjs';

const routes = new Map([
  ['README.md', '/'], ['faq-general.md', '/start-here/faq-general/'],
  ['sections/featured-collection.md', '/collection-sections/featured-collection/'],
  ['sections/bold-slideshow.md', '/hero-and-slideshows/bold-slideshow/'],
]);
const page = { label: 'Featured Collection', file: 'sections/featured-collection.md', group: 'Collection sections', route: '/collection-sections/featured-collection/', stem: 'featured-collection' };

test('strips H1, removes On this page, rewrites links and images', () => {
  const src = `# Featured Collection

Intro with [FAQ](../faq-general.md#shipping) and [Bold](bold-slideshow.md).

![Shot](../.gitbook/assets/sections/featured-collection.png)

**On this page**

- [Section Settings](#section-settings)
  - [Colors](#colors)

---

## ⚙️ Section Settings

Jump to [FAQ](#faq) or [Shopify](https://shopify.com) or [home](../README.md).
`;
  const out = transformPage({ page, source: src, routes });
  assert.ok(out.startsWith('---\ntitle: "Featured Collection"\n---\n'));
  assert.ok(!out.includes('# Featured Collection\n'));
  assert.ok(!out.includes('On this page'));
  assert.ok(out.includes('[FAQ](/start-here/faq-general/#shipping)'));
  assert.ok(out.includes('[Bold](/hero-and-slideshows/bold-slideshow/)'));
  assert.ok(out.includes('![Shot](/assets/sections/featured-collection.png)'));
  assert.ok(out.includes('[FAQ](#faq)'));
  assert.ok(out.includes('(https://shopify.com)'));
  assert.ok(out.includes('[home](/)'));
  assert.ok(out.includes('## ⚙️ Section Settings'));
});

test('page without the block keeps its body', () => {
  const guide = { ...page, label: 'Build for success: Fashion', file: 'guide-fashion.md', route: '/guides/guide-fashion/' };
  const out = transformPage({ page: guide, source: '# Fashion\n\nBody text.\n\n---\n\nMore.\n', routes });
  assert.ok(out.startsWith('---\ntitle: "Build for success: Fashion"\n---\n'));
  assert.ok(out.includes('Body text.\n\n---\n\nMore.'));
});

test('README takes its title from the H1', () => {
  const readme = { label: 'README', file: 'README.md', group: null, route: '/', stem: 'README' };
  const out = transformPage({ page: readme, source: '# Universe theme documentation\n\nHi [FAQ](faq-general.md).\n', routes });
  assert.ok(out.startsWith('---\ntitle: "Universe theme documentation"\n---\n'));
  assert.ok(out.includes('[FAQ](/start-here/faq-general/)'));
});

test('unknown link target throws naming page and link', () => {
  assert.throws(
    () => transformPage({ page, source: '# T\n\n[x](nope.md)\n', routes }),
    (e) => e.message.includes('sections/featured-collection.md') && e.message.includes('nope.md'),
  );
});
