import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand } from './brand';
import { FPS, scenes, Scene } from './script';
import manifest from '../drawer-cart/voice/manifest.json';

const TAIL = 0.5; // seconds of silence after each narration
export const sceneSeconds = (s: Scene) => Math.max(s.seconds, (manifest as any)[s.id]?.seconds + TAIL || 0);
export const sceneFrames = (s: Scene) => Math.round(sceneSeconds(s) * FPS);
export const totalFrames = () => scenes.reduce((n, s) => n + sceneFrames(s), 0);

const fontCss = `
@font-face { font-family: "Figtree"; src: url("${staticFile('brand/fonts/figtree/Figtree-VariableFont_wght.ttf')}") format("truetype"); font-weight: 300 900; }
@font-face { font-family: "Barracuda"; src: url("${staticFile('brand/fonts/barracuda/Barracuda-regular.ttf')}") format("truetype"); font-weight: 400; }
@font-face { font-family: "Barracuda"; src: url("${staticFile('brand/fonts/barracuda/Barracuda-Bold.ttf')}") format("truetype"); font-weight: 700; }`;
const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(900px 700px at 20% 50%, rgba(120,82,252,.35), transparent 70%), radial-gradient(800px 600px at 85% 45%, rgba(67,52,181,.4), transparent 70%), linear-gradient(180deg, #150e3a 0%, ${brand.darkViolet} 100%)`, fontFamily: brand.fontCopy, color: brand.white }}>
    <style>{fontCss}</style>
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(222,220,253,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(222,220,253,.045) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(900px 600px at 50% 50%, #000 30%, transparent 100%)' }} />
    {children}
  </AbsoluteFill>
);

const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style }}>{children}</div>;
};

// Narration shown as captions: the text is split into sentences and spread over the audio length.
const Captions: React.FC<{ text: string; seconds: number }> = ({ text, seconds }) => {
  const frame = useCurrentFrame();
  const parts = text.match(/[^.!?]+[.!?]?/g)?.map(s => s.trim()).filter(Boolean) ?? [text];
  const weights = parts.map(p => p.length); const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0; const t = frame / FPS;
  let current = parts[parts.length - 1];
  for (let i = 0; i < parts.length; i++) { const len = seconds * weights[i] / total; if (t < acc + len) { current = parts[i]; break; } acc += len; }
  if (t > seconds) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 1400, padding: '14px 28px', borderRadius: 18, background: 'rgba(17,11,47,.78)', fontSize: 34, lineHeight: 1.3, textAlign: 'center', color: brand.white, boxShadow: '0 10px 40px rgba(0,0,0,.35)' }}>{current}</div>
    </div>
  );
};

const Chapter: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <Rise delay={6} style={{ position: 'absolute', left: 120, right: 120, top: 26, height: 60, display: 'flex', alignItems: 'center', gap: 18 }}>
    <div style={{ background: brand.lime, color: brand.darkViolet, fontFamily: brand.fontAccent, fontSize: 28, padding: '4px 16px', borderRadius: 999 }}>{String(n).padStart(2, '0')}</div>
    <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-.01em' }}>{label}</div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: brand.lilac }}>Universe theme by <Img src={staticFile('brand/logo/logo_white.svg')} style={{ height: 34 }} /></div>
  </Rise>
);

const Clip: React.FC<{ s: Scene; n: number }> = ({ s, n }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const seconds = sceneSeconds(s);
  return (
    <Bg>
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
        <div style={{ width: 1680, height: 945, borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.55)', outline: '1px solid rgba(222,220,253,.18)', transform: `scale(${0.96 + 0.04 * p})`, opacity: p, background: '#fff' }}>
          <OffthreadVideo src={staticFile(s.clip!)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} startFrom={Math.round((s.clipOffset ?? 0) * FPS)} muted />
        </div>
      </AbsoluteFill>
      <Chapter n={n} label={s.chapter} />
      <Captions text={s.voice} seconds={seconds} />
    </Bg>
  );
};

const Intro: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 400], [0, -40]);
  return (
    <Bg>
      <Img src={staticFile('brand/elements/glass-shapes/Torus_3x_Knot0000.png')} style={{ position: 'absolute', right: 120, top: 120 + drift * 0.5, width: 460, opacity: .9, transform: 'rotate(-12deg)' }} />
      <Img src={staticFile('brand/elements/glass-shapes/Spring_Thin_Tall0000.png')} style={{ position: 'absolute', left: 140, bottom: 90 + drift, width: 360, opacity: .9, transform: 'rotate(18deg)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', padding: '0 220px' }}>
        <Rise delay={2}><div style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 34, color: brand.lilac }}>Universe theme by <Img src={staticFile('brand/logo/logo_white.svg')} style={{ height: 52 }} /></div></Rise>
        <Rise delay={10}><div style={{ fontSize: 132, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1, marginTop: 28 }}>Drawer Cart</div></Rise>
        <Rise delay={18}><div style={{ fontSize: 52, marginTop: 22, color: brand.white }}>Setup <span style={{ fontFamily: brand.fontAccent, color: brand.lime }}>guide</span></div></Rise>
        <Rise delay={30} style={{ marginTop: 56, display: 'flex', gap: 14 }}>
          {scenes.filter(x => x.kind === 'clip').map((x, i) => <div key={x.id} style={{ padding: '10px 18px', borderRadius: 999, background: 'rgba(222,220,253,.12)', fontSize: 26, color: brand.lilac }}>{String(i + 1).padStart(2, '0')} {x.chapter}</div>)}
        </Rise>
      </AbsoluteFill>
      <Captions text={s.voice} seconds={sceneSeconds(s)} />
    </Bg>
  );
};

const Outro: React.FC<{ s: Scene }> = ({ s }) => (
  <Bg>
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 26 }}>
      <Rise delay={2}><Img src={staticFile('brand/logo/logo_white.svg')} style={{ width: 620 }} /></Rise>
      <Rise delay={14}><div style={{ fontSize: 44, color: brand.lilac }}>Full documentation at</div></Rise>
      <Rise delay={20}><div style={{ fontSize: 48, fontWeight: 600, color: brand.lime, fontFamily: brand.fontAccent }}>developpy.gitbook.io/universe-doc-git</div></Rise>
    </AbsoluteFill>
    <Captions text={s.voice} seconds={sceneSeconds(s)} />
  </Bg>
);

export const DrawerCart: React.FC = () => {
  let from = 0; let n = 0;
  return (
    <AbsoluteFill style={{ background: brand.darkViolet }}>
      {scenes.map(s => {
        const len = sceneFrames(s); const start = from; from += len;
        if (s.kind === 'clip') n += 1; const idx = n;
        const voice = (manifest as any)[s.id];
        return (
          <Sequence key={s.id} from={start} durationInFrames={len}>
            {s.kind === 'intro' ? <Intro s={s} /> : s.kind === 'outro' ? <Outro s={s} /> : <Clip s={s} n={idx} />}
            {voice ? <Audio src={staticFile(voice.file)} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
