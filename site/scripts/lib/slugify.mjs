// Port of make_anchor() in generator/generate.py.
export function slugify(text) {
  const s = text.toLowerCase().replaceAll(' ', '-').replace(/[^a-z0-9-]/g, '-');
  return s.replace(/-+/g, '-').replace(/^-|-$/g, '');
}
