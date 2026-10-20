# generator/tests/test_anchors.py
import json, subprocess, sys, os, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = os.path.join(ROOT, '.themes', 'universe-empty-3rd')

class AnchorsTest(unittest.TestCase):
    def run_it(self, name):
        out = subprocess.check_output([sys.executable, os.path.join(ROOT, 'generator', 'anchors.py'), THEME, name])
        return json.loads(out)

    def test_featured_collection(self):
        d = self.run_it('u-featured-collection.liquid')
        self.assertEqual(d['page'], 'featured-collection')
        self.assertEqual(d['subdir'], 'sections')
        blocks = {b['type']: b for b in d['blocks']}
        self.assertEqual(blocks['collection-block']['anchor'], 'collection')
        self.assertTrue(blocks['collection-block']['capture'])
        self.assertFalse(blocks['shape_divider']['capture'])

    def test_root_section(self):
        d = self.run_it('u-drawer-cart.liquid')
        self.assertEqual(d['subdir'], '')
        self.assertEqual(d['page'], 'drawer-cart')
