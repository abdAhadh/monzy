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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E3E8EF]">
      <div className="flex items-center justify-between px-5 h-12">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-2.5">
          <MonzyLogo size={24} />
          <span className="font-semibold text-[#1A1F36] text-sm tracking-tight">Monzy AR</span>
          <span className="text-[#E3E8EF] text-sm font-light">|</span>
          <motion.span
            key={scene?.title}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#697386] text-xs font-medium"
          >
            {scene?.title}
          </motion.span>
        </div>

        {/* Right: Nav dots + play/pause */}
        <div className="flex items-center gap-3">
          <NavDots
            total={NAV_GROUPS.length}
            active={groupIndex}
            onSelect={(i) => {
              const group = NAV_GROUPS[i];
              const firstScene = SCENES.find(s => s.group === group);
              if (firstScene) onSceneChange(firstScene.id);
            }}
          />
          <button
            onClick={onTogglePlay}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F0F4F8] transition-colors text-[#8792A2] hover:text-[#425466]"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="3.5" height="10" rx="1"/>
                <rect x="7.5" y="1" width="3.5" height="10" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 1.5l9 4.5-9 4.5V1.5z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-[#F0F4F8]">
        <motion.div
          className="h-full bg-[#635BFF]"
          initial={false}
          animate={{ width: `${(currentScene / SCENES.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
