import React from 'react';
import { Composition } from 'remotion';
import { DrawerCart, totalFrames } from './DrawerCart';
import { FPS } from './script';

export const Root: React.FC = () => (
  <Composition id="DrawerCart" component={DrawerCart} durationInFrames={totalFrames()} fps={FPS} width={1920} height={1080} />
);
