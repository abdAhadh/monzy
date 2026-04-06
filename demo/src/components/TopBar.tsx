import React from 'react';
import { motion } from 'framer-motion';
import MonzyLogo from './MonzyLogo';
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E4DC]">
      <div className="flex items-center justify-between px-5 h-12">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://monzyai.com"
            target="_self"
            className="flex items-center gap-2.5 no-underline"
            style={{ textDecoration: 'none' }}
          >
            <MonzyLogo size={24} />
            <span className="font-semibold text-[#111111] text-sm tracking-tight">Monzy</span>
          </a>
          <span className="text-[#E8E4DC] text-sm font-light">|</span>
          <motion.span
            key={scene?.title}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#777777] text-xs font-medium"
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
