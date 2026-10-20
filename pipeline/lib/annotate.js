// Draws brand-coloured boxes over the page, in a fixed-position SVG added to the top document so
// it sits above the editor iframe.
const COLOR = '#7852fc';
const PAD = 6;
const STROKE = 3;
const ID = 'docs-annotation-overlay';

// `bounds` is the visible area in css px (the screenshot clip); it defaults to the viewport.
// Each box is first inset so that its padding and the whole stroke stay inside `bounds`.
export async function annotate(page, boxes, { bounds = null } = {}) {
  await page.evaluate(({ boxes, bounds, COLOR, PAD, STROKE, ID }) => {
    document.getElementById(ID)?.remove();
    const B = bounds || { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    const edge = PAD + STROKE / 2 + 1;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.id = ID;
    svg.setAttribute('width', String(window.innerWidth));
    svg.setAttribute('height', String(window.innerHeight));
    svg.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;overflow:visible';
    for (const b of boxes) {
      const x1 = Math.max(b.x, B.x + edge), y1 = Math.max(b.y, B.y + edge);
      const x2 = Math.min(b.x + b.width, B.x + B.width - edge), y2 = Math.min(b.y + b.height, B.y + B.height - edge);
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', x1 - PAD); r.setAttribute('y', y1 - PAD);
      r.setAttribute('width', x2 - x1 + 2 * PAD); r.setAttribute('height', y2 - y1 + 2 * PAD);
      r.setAttribute('rx', '8'); r.setAttribute('fill', 'none');
      r.setAttribute('stroke', COLOR); r.setAttribute('stroke-width', String(STROKE));
      svg.appendChild(r);
    }
    document.body.appendChild(svg);
  }, { boxes, bounds, COLOR, PAD, STROKE, ID });
}

export async function clearAnnotations(page) {
  await page.evaluate(id => document.getElementById(id)?.remove(), ID);
}
