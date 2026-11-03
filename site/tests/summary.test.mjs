import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseSummary } from '../scripts/lib/summary.mjs';

const sample = `# Table of contents

* [README](README.md)

## Start here

* [Getting Started](getting-started.md)

## Guides

* [Build for success: Fashion](guide-fashion.md)
* [Custom templates](guides/guide-custom-template.md)
`;

test('parses groups and routes', () => {
  const { groups, pages } = parseSummary(sample);
  assert.equal(pages.length, 4);
  assert.deepEqual(pages[0], { label: 'README', file: 'README.md', group: null, route: '/', stem: 'README' });
  assert.equal(groups.length, 2);
  assert.equal(groups[0].slug, 'start-here');
  assert.deepEqual(groups[1].pages[1], {
    label: 'Custom templates', file: 'guides/guide-custom-template.md',
    group: 'Guides', route: '/guides/guide-custom-template/', stem: 'guide-custom-template',
  });
});

test('throws on a route collision', () => {
  const dup = sample + '\n## Start Here\n\n* [Again](other/getting-started.md)\n';
  assert.throws(() => parseSummary(dup), /getting-started/);
});

test('parses the real SUMMARY', () => {
  const real = readFileSync(new URL('../../theme-docs/SUMMARY.md', import.meta.url), 'utf8');
  const { groups, pages } = parseSummary(real);
  assert.equal(groups.length, 15);
  assert.equal(pages.length, 66);
  assert.equal(pages.find(p => p.file === 'sections/featured-collection.md').route, '/collection-sections/featured-collection/');
  assert.equal(pages.find(p => p.file === 'header-nav.md').route, '/global-sections/header-nav/');
});
