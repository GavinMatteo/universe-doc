// Timeline of the Drawer Cart video. Durations in seconds; voice files are produced by voice.sh.
export type Scene = {
  id: string; chapter: string; kind: 'intro' | 'clip' | 'outro';
  clip?: string;            // path under public/
  voice: string;            // narration text, also the file name stem of the audio
  seconds: number;          // scene length on the timeline
  clipOffset?: number;      // seconds to skip at the start of the clip
};
export const FPS = 30;
export const scenes: Scene[] = [
  { id: 'intro', chapter: 'Introduction', kind: 'intro', voice: 'This is the Drawer Cart in Universe. It opens the moment a visitor adds a product, shows how close they are to free shipping, suggests one more item, and gets them to checkout without leaving the page. Here is how to set it up.', seconds: 16 },
  { id: 's1', chapter: 'What the visitor sees', kind: 'clip', clip: 'drawer-cart/s1-add-to-cart.mp4', clipOffset: 0.8, voice: 'On the storefront the drawer appears from the right. The visitor can change quantities, leave a note, enter a discount code, and go straight to checkout. Everything you see here is a setting in the theme editor.', seconds: 14 },
  { id: 's2', chapter: 'Cross-sell and free shipping bar', kind: 'clip', clip: 'drawer-cart/s2-cross-sell.mp4', clipOffset: 0.8, voice: 'The left column is the cross-sell list. You pick the products yourself, so every visitor sees the same suggestions. Above the items, the free shipping bar reads the threshold from your shipping settings and updates as the cart grows.', seconds: 16 },
  { id: 's3', chapter: 'Notes and discount codes', kind: 'clip', clip: 'drawer-cart/s3-note-discount.mp4', clipOffset: 0.8, voice: 'Cart notes and the discount code field are two toggles. Switch them on and the drawer shows a note area and a code input with its own apply button.', seconds: 12 },
  { id: 'outro', chapter: 'Outro', kind: 'outro', voice: 'That is the Drawer Cart. The full list of settings, with one line for each, is in the documentation linked below.', seconds: 9 },
];
