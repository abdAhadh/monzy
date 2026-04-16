import React from 'react';
import { motion } from 'framer-motion';
import RatioLogo from './RatioLogo';
import NavDots from './NavDots';
import { SCENES, NAV_GROUPS } from '../types';

interface TopBarProps {
  currentScene: number;
  onSceneChange: (scene: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function TopBar({ currentScene, onSceneChange, isPlaying, onTogglePlay }: TopBarProps) {
  const scene = SCENES[currentScene - 1];
  const activeGroup = scene?.group ?? 'intro';
  const groupIndex = NAV_GROUPS.indexOf(activeGroup);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A4E]" style={{ background: '#1A1A2E' }}>
      <div className="flex items-center justify-between px-5 h-12">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://tryratio.io"
            target="_self"
            className="flex items-center gap-2.5 no-underline"
            style={{ textDecoration: 'none' }}
          >
            <RatioLogo size={24} />
            <span className="font-semibold text-white text-sm tracking-tight">Ratio</span>
          </a>
          <span className="text-[#3A3A5E] text-sm font-light">|</span>
          <motion.span
            key={scene?.title}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#9999BB] text-xs font-medium"
          >
            {scene?.title}
          </motion.span>
        </div>

        {/* Right: empty — controls are in hover overlay */}
        <div />
      </div>


    </div>
  );
}
