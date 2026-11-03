import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../scripts/lib/slugify.mjs';

test('matches make_anchor golden values', () => {
  assert.equal(slugify('⚙️ Section Settings'), 'section-settings');
  assert.equal(slugify('Vendor/SKU'), 'vendor-sku');
  assert.equal(slugify("What's new"), 'what-s-new');
  assert.equal(slugify('Content and Layout'), 'content-and-layout');
  assert.equal(slugify('Testimonials and social proof'), 'testimonials-and-social-proof');
  assert.equal(slugify('  Hero --- and  slideshows '), 'hero-and-slideshows');
});
