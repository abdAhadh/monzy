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

// ── Audio-driven timeline ─────────────────────────────────────────────────────
// Playthrough order (scenes 6 & 7 are skipped via scene 5's skipTo)
const PLAYTHROUGH_IDS = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12];

const SCENE_TIMELINE = (() => {
  let t = 0;
  return PLAYTHROUGH_IDS.map(id => {
    const s = SCENES.find(s => s.id === id)!;
    const entry = { id, start: t, end: t + s.duration };
    t += s.duration;
    return entry;
  });
})();

const TOTAL_DURATION = SCENE_TIMELINE[SCENE_TIMELINE.length - 1].end;

function sceneAtTime(t: number): number {
  for (const e of SCENE_TIMELINE) {
    if (t < e.end) return e.id;
  }
  return SCENE_TIMELINE[SCENE_TIMELINE.length - 1].id;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

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
          className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
        >
          <div className="bg-black/65 text-white text-[15px] font-medium px-4 py-2 rounded-lg leading-relaxed backdrop-blur-sm text-center max-w-2xl">
            {cue.text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Seekable progress bar ─────────────────────────────────────────────────────
function ProgressBar({
  voTime,
  hovered,
  onSeek,
}: {
  voTime: number;
  hovered: boolean;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = Math.min(voTime / TOTAL_DURATION, 1);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * TOTAL_DURATION);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 select-none">
      {/* Timestamp — visible on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-end px-4 py-1.5"
          >
            <span className="text-[11px] font-mono text-[#8792A2]">
              {formatTime(voTime)} <span className="text-[#C8D4E0]">/</span> {formatTime(TOTAL_DURATION)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track */}
      <div
        ref={barRef}
        onClick={handleBarClick}
        className="w-full bg-[#E3E8EF] cursor-pointer relative"
        style={{ height: hovered ? 6 : 2, transition: 'height 0.15s ease' }}
      >
        <div
          className="h-full bg-[#635BFF] transition-none"
          style={{ width: `${progress * 100}%` }}
        />
        {hovered && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#635BFF] border-2 border-white shadow-md pointer-events-none"
            style={{ left: `${progress * 100}%`, marginLeft: -6 }}
          />
        )}
      </div>
    </div>
  );
}

function SceneRenderer({ scene, isActive }: { scene: number; isActive: boolean }) {
  switch (scene) {
    case 1:  return <Scene01Intro isActive={isActive} />;
    case 2:  return <Scene02Sync isActive={isActive} />;
    case 3:  return <Scene03Segmentation isActive={isActive} />;
    case 4:  return <Scene04Collections isActive={isActive} />;
    case 5:  return <Scene05Activity isActive={isActive} />;
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
  const [isPlaying, setIsPlaying]       = useState(false);
  const [hasStarted, setHasStarted]     = useState(false);
  const [voTime, setVoTime]             = useState(0);
  const [screenHovered, setScreenHovered] = useState(false);

  const voRef  = useRef<HTMLAudioElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null);

  const resetToStart = useCallback(() => {
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentScene(1);
    setVoTime(0);
    if (voRef.current)  { voRef.current.pause();  voRef.current.currentTime  = 0; }
    if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
  }, []);

  const startDemo = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsPlaying(true);
  }, [hasStarted]);

  // Drive currentScene from audio time
  useEffect(() => {
    if (!hasStarted) return;
    setCurrentScene(sceneAtTime(voTime));
  }, [voTime, hasStarted]);

  // Audio: play/pause
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

  // Track VO currentTime → voTime
  useEffect(() => {
    const vo = voRef.current;
    if (!vo) return;
    const update = () => setVoTime(vo.currentTime);
    vo.addEventListener('timeupdate', update);
    return () => vo.removeEventListener('timeupdate', update);
  }, []);

  // Seek handler
  const handleSeek = useCallback((t: number) => {
    if (voRef.current) {
      voRef.current.currentTime = t;
      setVoTime(t);
    }
    setCurrentScene(sceneAtTime(t));
    if (!isPlaying && hasStarted) {
      setIsPlaying(true);
    }
  }, [isPlaying, hasStarted]);

  // Space bar → play/pause
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' && hasStarted) { e.preventDefault(); setIsPlaying(p => !p); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hasStarted]);

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden bg-white font-sans"
      onMouseEnter={() => setScreenHovered(true)}
      onMouseLeave={() => setScreenHovered(false)}
      onMouseMove={() => setScreenHovered(true)}
    >
      <audio
        ref={voRef}
        src="/vo.mp3"
        preload="auto"
        onCanPlay={() => { if (voRef.current) voRef.current.volume = 1.0; }}
        onEnded={resetToStart}
      />
      <audio ref={bgmRef} src="/bgm.mp3" preload="auto" loop
        onCanPlay={() => { if (bgmRef.current) bgmRef.current.volume = 0.16; }} />

      <TopBar
        currentScene={currentScene}
        onSceneChange={() => {}}
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

      {/* Seekable progress bar */}
      {hasStarted && (
        <ProgressBar
          voTime={voTime}
          hovered={screenHovered}
          onSeek={handleSeek}
        />
      )}

      {/* Centered play/pause — appears on hover while playing */}
      <AnimatePresence>
        {hasStarted && screenHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
          >
            <button
              className="w-20 h-20 rounded-full bg-[#635BFF] flex items-center justify-center shadow-xl pointer-events-auto"
              onClick={() => setIsPlaying(p => !p)}
            >
              {isPlaying ? (
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                  <rect x="1" y="1" width="7" height="24" rx="2" fill="white" />
                  <rect x="13" y="1" width="7" height="24" rx="2" fill="white" />
                </svg>
              ) : (
                <svg width="24" height="28" viewBox="0 0 20 24" fill="none">
                  <path d="M2 2L18 12L2 22V2Z" fill="white" />
                </svg>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-to-start overlay */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.55)' }}
            onClick={startDemo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-24 h-24 rounded-full bg-[#635BFF] flex items-center justify-center shadow-xl">
                <svg width="28" height="34" viewBox="0 0 20 24" fill="none">
                  <path d="M2 2L18 12L2 22V2Z" fill="white" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
