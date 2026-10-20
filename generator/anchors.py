#!/usr/bin/env python3
"""Print page slug and block anchors of one section as JSON.
Usage: python3 generator/anchors.py <theme-dir> <liquid-name>
"""

import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate import (load_labels, load_schema, get_label, make_anchor,
                      output_filename, ROOT_SECTIONS)

NO_CAPTURE = ('shape_divider', '@app')
# These two blocks get fixed headings in write_section_doc.
FIXED_HEADINGS = {'shape_divider': 'Shape Divider', '@app': 'App Block'}


def build(theme_dir, liquid_name):
    all_labels = load_labels(theme_dir)
    schema = load_schema(os.path.join(theme_dir, 'sections', liquid_name)) or {}
    section_label = get_label(schema.get('name', ''), '', all_labels)
    blocks = []
    for block in schema.get('blocks', []):
        btype = block.get('type', '')
        label = FIXED_HEADINGS.get(btype) or get_label(block.get('name', ''), btype, all_labels)
        blocks.append({
            'type': btype,
            'label': label,
            'anchor': make_anchor(label),
            'capture': btype not in NO_CAPTURE,
        })
    return {
        'page': output_filename(liquid_name)[:-len('.md')],
        'subdir': '' if liquid_name in ROOT_SECTIONS else 'sections',
        'section_label': section_label,
        'blocks': blocks,
    }


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('usage: anchors.py <theme-dir> <liquid-name>')
    print(json.dumps(build(sys.argv[1], sys.argv[2])))
