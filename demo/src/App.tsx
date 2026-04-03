import React, { useState, useEffect, useCallback, useRef } from 'react';
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

// ── Subtitle cues — keyed to actual audio timestamps ─────────────────────────
const SUBTITLE_CUES: { start: number; end: number; text: string }[] = [
  { start: 0.0,   end: 3.8,   text: "This is Monzy. Your AI Accounts Receivables Specialist." },
  { start: 4.8,   end: 13.6,  text: "It connects to your ERP, CRM, Accounting systems and Bank Accounts to extract your AR data automatically." },
  { start: 14.6,  end: 20.4,  text: "Then it reads your payment history and automatically buckets customers by their risk levels." },
  { start: 21.2,  end: 27.3,  text: "For each bucket, you can set a follow-up journey. Monzy runs it for every customer automatically." },
  { start: 28.1,  end: 35.5,  text: "A WhatsApp reminder goes out — the customer replies with a commitment date, Monzy updates the AR record instantly." },
  { start: 36.0,  end: 38.8,  text: "When a customer prefers a call, Monzy remembers it, gets data on the receivables and updates your AR record." },
  { start: 39.5,  end: 44.8,  text: "An email reply comes in, and payment details are extracted automatically." },
  { start: 45.4,  end: 59.5,  text: "We know you run into disputes — a quantity mismatch. Monzy documents it and escalates it to the right person in your team." },
  { start: 60.1,  end: 63.3,  text: "Every customer handled. Every record updated." },
  { start: 64.1,  end: 75.4,  text: "By ensuring communication with each and every customer or partner, Monzy ensures a real-time AR view — their status, risk level, and last update." },
  { start: 76.2,  end: 91.3,  text: "Monzy also tracks credit health over time. If one of your distributors has been slipping, Monzy recommends pulling back their credit limit and tightening the payment window." },
  { start: 91.9,  end: 102.8, text: "Monzy handles cash applications as well — bank transactions matched to invoices, TDS reconciled, PDCs logged. Unmatched payments flagged on Slack instantly." },
  { start: 103.3, end: 111.5, text: "Get a real-time view of your AR, while Monzy runs in the background." },
  { start: 112.3, end: 125.3, text: "Let your AR team focus on what actually matters, while Monzy cuts your DSO in half." },
];

function SubtitleOverlay({ time }: { time: number }) {
  const cue = SUBTITLE_CUES.find(c => time >= c.start && time < c.end);
  return (
    <AnimatePresence mode="wait">
      {cue && (
        <motion.div
          key={cue.start}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
        >
          <div className="bg-black/65 text-white text-[15px] font-medium px-4 py-2 rounded-lg leading-relaxed backdrop-blur-sm text-center max-w-2xl">
            {cue.text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
  const [isPlaying, setIsPlaying]       = useState(true);
  const [progress, setProgress]         = useState(0);
  const [voTime, setVoTime]             = useState(0);

  const voRef  = useRef<HTMLAudioElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null);

  const totalScenes = SCENES.length;
  const sceneDef    = SCENES[currentScene - 1];
  const isLastScene = currentScene === totalScenes;

  const goToScene = useCallback((n: number) => {
    setCurrentScene(Math.min(Math.max(1, n), totalScenes));
    setProgress(0);
  }, [totalScenes]);

  // Auto-advance timer — stops at last scene
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
        if (isLastScene) {
          // End of demo — stop playing
          setIsPlaying(false);
          setProgress(1);
        } else {
          setCurrentScene(prev => {
            const next = sceneDef.skipTo ?? prev + 1;
            setProgress(0);
            return next;
          });
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentScene, isPlaying, sceneDef.duration, isLastScene, sceneDef.skipTo]);

  // Audio: play/pause with demo
  useEffect(() => {
    const vo  = voRef.current;
    const bgm = bgmRef.current;
    if (!vo || !bgm) return;
    if (isPlaying) {
      vo.play().catch(() => {});
      bgm.play().catch(() => {});
    } else {
      vo.pause();
      bgm.pause();
    }
  }, [isPlaying]);

  // Audio: restart VO when navigating back to scene 1
  useEffect(() => {
    if (currentScene === 1 && voRef.current) {
      voRef.current.currentTime = 0;
      if (isPlaying) voRef.current.play().catch(() => {});
    }
  }, [currentScene]);

  // Subtitle: track VO currentTime
  useEffect(() => {
    const vo = voRef.current;
    if (!vo) return;
    const update = () => setVoTime(vo.currentTime);
    vo.addEventListener('timeupdate', update);
    return () => vo.removeEventListener('timeupdate', update);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToScene(currentScene + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToScene(currentScene - 1);
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentScene, goToScene]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-white font-sans">
      <audio ref={voRef}  src="/vo.mp3"  preload="auto" />
      <audio ref={bgmRef} src="/bgm.mp3" preload="auto" loop
        onCanPlay={() => { if (bgmRef.current) bgmRef.current.volume = 0.18; }} />

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

      {/* Subtitles */}
      <SubtitleOverlay time={voTime} />

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
