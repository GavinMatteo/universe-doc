// Draws brand-coloured boxes (and a connector between the first two) over the page, in a
// fixed-position SVG added to the top document so it sits above the editor iframe.
const COLOR = '#7852fc';
const PAD = 6;
const ID = 'docs-annotation-overlay';

export async function annotate(page, boxes) {
  await page.evaluate(({ boxes, COLOR, PAD, ID }) => {
    document.getElementById(ID)?.remove();
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.id = ID;
    svg.setAttribute('width', String(window.innerWidth));
    svg.setAttribute('height', String(window.innerHeight));
    svg.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;overflow:visible';
    // Pad each box, then keep it 2 px inside the viewport so no stroke is cut at the edges.
    const W = window.innerWidth, H = window.innerHeight;
    const padded = boxes.map(b => {
      const x1 = Math.max(2, b.x - PAD), y1 = Math.max(2, b.y - PAD);
      const x2 = Math.min(W - 2, b.x + b.width + PAD), y2 = Math.min(H - 2, b.y + b.height + PAD);
      return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    });
    if (padded.length >= 2) {
      const [a, b] = padded;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', a.x + a.width); line.setAttribute('y1', a.y + a.height / 2);
      line.setAttribute('x2', b.x); line.setAttribute('y2', Math.min(Math.max(a.y + a.height / 2, b.y + 16), b.y + b.height - 16));
      line.setAttribute('stroke', COLOR); line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    }
    for (const p of padded) {
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', p.x); r.setAttribute('y', p.y);
      r.setAttribute('width', p.width); r.setAttribute('height', p.height);
      r.setAttribute('rx', '8'); r.setAttribute('fill', 'none');
      r.setAttribute('stroke', COLOR); r.setAttribute('stroke-width', '3');
      svg.appendChild(r);
    }
    document.body.appendChild(svg);
  }, { boxes, COLOR, PAD, ID });
}

export async function clearAnnotations(page) {
  await page.evaluate(id => document.getElementById(id)?.remove(), ID);
}
