import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SCENES } from './types';

import TopBar from './components/TopBar';

import Scene01Intro from './scenes/Scene01Intro';
import Scene02Sync from './scenes/Scene02Sync';
import Scene03Segmentation from './scenes/Scene03Segmentation';
import Scene04Collections from './scenes/Scene04Collections';
import Scene05Activity from './scenes/Scene05Activity';
import Scene08ARTable from './scenes/Scene08ARTable';
import Scene14Credit from './scenes/Scene14Credit';
import Scene16CashApp from './scenes/Scene16CashApp';
import Scene18Dashboard from './scenes/Scene18Dashboard';

const SCENE_VARIANTS = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function SceneRenderer({ scene, isActive }: { scene: number; isActive: boolean }) {
  switch (scene) {
    case 1:  return <Scene01Intro isActive={isActive} />;
    case 2:  return <Scene02Sync isActive={isActive} />;
    case 3:  return <Scene03Segmentation isActive={isActive} />;
    case 4:  return <Scene04Collections isActive={isActive} />;
    case 5:  return <Scene05Activity isActive={isActive} />;
    case 6:  return <Scene05Activity isActive={isActive} />;
    case 7:  return <Scene05Activity isActive={isActive} />;
    case 8:  return <Scene08ARTable isActive={isActive} />;
    case 9:  return <Scene14Credit isActive={isActive} />;
    case 10: return <Scene16CashApp isActive={isActive} />;
    case 11: return <Scene18Dashboard isActive={isActive} />;
    case 12: return <Scene01Intro isActive={isActive} />;
    default: return <Scene01Intro isActive={isActive} />;
  }
}

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0–1 within current scene

  const totalScenes = SCENES.length;
  const sceneDef = SCENES[currentScene - 1];

  const goToScene = useCallback((n: number) => {
    setCurrentScene(Math.min(Math.max(1, n), totalScenes));
    setProgress(0);
  }, [totalScenes]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    const duration = sceneDef.duration * 1000;
    let elapsed = 0;
    const interval = 50;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed >= duration) {
        clearInterval(timer);
        setCurrentScene(prev => {
          const next = sceneDef.skipTo ?? (prev >= totalScenes ? 1 : prev + 1);
          setProgress(0);
          return next;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentScene, isPlaying, sceneDef.duration, totalScenes]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToScene(currentScene + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToScene(currentScene - 1);
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentScene, goToScene]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-white font-sans">
      <TopBar
        currentScene={currentScene}
        onSceneChange={goToScene}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(p => !p)}
      />

      {/* Main scene area */}
      <div className="flex-1 mt-12 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            variants={SCENE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col"
          >
            <SceneRenderer scene={currentScene} isActive={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scene timer bar (bottom) */}
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-[#F0F4F8] z-50">
        <motion.div
          className="h-full bg-[#635BFF]"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Click zones for prev/next */}
      <div
        className="fixed left-0 top-12 bottom-0 w-16 z-40 cursor-w-resize"
        onClick={() => goToScene(currentScene - 1)}
      />
      <div
        className="fixed right-0 top-12 bottom-0 w-16 z-40 cursor-e-resize"
        onClick={() => goToScene(currentScene + 1)}
      />
    </div>
  );
}
