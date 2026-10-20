import os, sys, tempfile, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'generator'))
import generate as g
from descriptions import SETTING_DESCRIPTIONS
from section_meta import SECTION_META
from context_overrides import CONTEXT_OVERRIDES
THEME = os.path.join(ROOT, '.themes', 'universe-empty-3rd')

def touch(p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'wb') as fh: fh.write(b'\x89PNG')

class ImageLineTest(unittest.TestCase):
    def test_prefix_for_sections_subdir(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'sections', 'x.png'))
            self.assertEqual(g.image_line(d, 'sections', 'sections/x.png', 'X'), '![X](../.gitbook/assets/sections/x.png)\n\n')
            self.assertEqual(g.image_line(d, '', 'sections/x.png', 'X'), '![X](.gitbook/assets/sections/x.png)\n\n')

    def test_missing_file_emits_nothing(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(g.image_line(d, 'sections', 'sections/nope.png', 'X'), '')

class SectionDocTest(unittest.TestCase):
    def render(self, assets):
        labels = g.load_labels(THEME)
        schema = g.load_schema(os.path.join(THEME, 'sections', 'u-featured-collection.liquid'))
        return g.write_section_doc('u-featured-collection.liquid', schema, SECTION_META['u-featured-collection.liquid'], labels, SETTING_DESCRIPTIONS, CONTEXT_OVERRIDES, assets_dir=assets)

    def test_all_three_families(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'sections', 'featured-collection.png'))
            touch(os.path.join(d, 'editor', 'featured-collection', 'section-settings.png'))
            touch(os.path.join(d, 'editor', 'featured-collection', 'collection.png'))
            touch(os.path.join(d, 'infographics', 'featured-collection', 'shape-divider.png'))
            md = self.render(d)
            self.assertIn('![Featured Collection](../.gitbook/assets/sections/featured-collection.png)', md)
            self.assertIn('(../.gitbook/assets/editor/featured-collection/section-settings.png)', md)
            self.assertIn('(../.gitbook/assets/editor/featured-collection/collection.png)', md)
            self.assertIn('(../.gitbook/assets/infographics/featured-collection/shape-divider.png)', md)
            self.assertLess(md.index('sections/featured-collection.png'), md.index('**On this page**'))
            self.assertLess(md.index('## ⚙️ Section Settings'), md.index('section-settings.png'))
            self.assertLess(md.index('### Collection'), md.index('featured-collection/collection.png'))

    def test_no_assets_dir_is_unchanged(self):
        self.assertNotIn('.gitbook/assets', self.render(None))

    def test_shape_divider_never_gets_editor_capture(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'editor', 'featured-collection', 'shape-divider.png'))
            self.assertNotIn('editor/featured-collection/shape-divider.png', self.render(d))
