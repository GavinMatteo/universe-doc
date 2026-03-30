# Universe Theme Documentation

This repository contains the documentation for the Universe Shopify theme and the generator script to update it.

## Repository structure

```
├── theme-docs/          All .md files synced with GitBook
│   ├── README.md        Global index (auto-generated)
│   ├── theme-settings.md
│   └── [section].md     One file per section
└── generator/
    ├── generate.py      Main script - run this to update docs
    ├── descriptions.py  Descriptions for every setting ID
    ├── section_meta.py  Intro, tips, and FAQ for every section
    └── context_overrides.py  Setting descriptions that differ by context
```

## How to update the documentation

### When the theme changes

1. Export the theme from Shopify admin: **Online Store > Themes > your theme > Export**
2. Open a terminal in this repository
3. Run:
   ```bash
   python3 generator/generate.py path/to/theme_export.zip
   ```
4. Review the changes in `theme-docs/`
5. Commit and push to GitHub
6. GitBook syncs automatically

### When you want to update text (tips, FAQ, descriptions)

- To update a section intro, tips, or FAQ: edit `generator/section_meta.py`
- To update a setting description: edit `generator/descriptions.py`
- To fix a description that is wrong in a specific context: edit `generator/context_overrides.py`
- After editing any of these files, run the generator again with the last theme zip

### GitBook sync setup

1. In GitBook, go to your space settings
2. Under Integrations, select GitHub
3. Connect this repository and set the Project directory to `theme-docs`
4. GitBook will automatically sync whenever you push to the main branch

## Updating with Claude

When sending a new theme zip to Claude for documentation updates:

1. Share the new theme zip file
2. Share the raw GitHub URL to `generator/descriptions.py`
3. Share the raw GitHub URL to `generator/section_meta.py`
4. Share the raw GitHub URL to `generator/context_overrides.py`

Claude will load your existing content, identify what changed, and return updated `.md` files.

## Requirements

- Python 3.8 or higher
- No external dependencies (uses standard library only)
