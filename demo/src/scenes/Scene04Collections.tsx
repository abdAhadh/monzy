import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props { isActive: boolean; }

const STEPS = [
  { day: 'Day 0',  label: 'Invoice sent',                 channel: null },
  { day: 'Day 25', label: 'Gentle reminder',              channel: 'Preferred channel' },
  { day: 'Day 32', label: 'Follow-up',                    channel: 'Preferred channel' },
  { day: 'Day 40', label: 'Escalation to senior contact', channel: null },
];

const CURSOR_APPEAR_MS = 1500;
const CURSOR_CLICK_MS  = 2650;

function CursorSVG() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
      <path d="M3 2L3 21L8 16L11.5 23.5L14.5 22L11 14.5L18 14.5L3 2Z"
        fill="white" stroke="#1A1F36" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Scene04Collections({ isActive }: Props) {
  const [ready, setReady]               = useState(false);
  const [cursorVisible, setCursorVisible]   = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setReady(false);
      setCursorVisible(false);
      setCursorClicking(false);
      return;
    }
    const t0 = setTimeout(() => setReady(true),          120);
    const t1 = setTimeout(() => setCursorVisible(true),  CURSOR_APPEAR_MS);
    const t2 = setTimeout(() => setCursorClicking(true), CURSOR_CLICK_MS);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      {/* Journey steps */}
      <div className="flex-1 overflow-auto px-6 py-6">

        {/* Bucket context pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 mb-6 border rounded px-3 py-1.5"
          style={{ background: '#FEF3C7', borderColor: '#FDE08A' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D97706' }} />
          <span className="text-xs font-semibold" style={{ color: '#92510B' }}>Bucket B: Slow Payers</span>
          <span style={{ color: '#D97706' }}>·</span>
          <span className="text-xs" style={{ color: '#92510B' }}>one-time setup, runs automatically</span>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <motion.div
            className="absolute left-[52px] top-4 bottom-4 w-px"
            style={{ originY: 0, background: '#E3E8EF' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: ready ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          />

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.day}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -16 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 py-4 rounded-lg px-2 -mx-2"
                style={
                  cursorClicking && i === 2
                    ? { backgroundColor: 'rgba(254, 243, 199, 0.5)' }
                    : {}
                }
              >
                <div className="w-12 flex-shrink-0 text-right">
                  <span className="font-mono text-[11px] font-semibold" style={{ color: '#D97706' }}>{step.day}</span>
                </div>
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center mt-0.5 relative z-10 transition-colors duration-150"
                  style={{ borderColor: cursorClicking && i === 2 ? '#D97706' : '#E3E8EF' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-150"
                    style={{ backgroundColor: cursorClicking && i === 2 ? '#D97706' : '#C8D4E0' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1A1F36]">{step.label}</span>
                    {step.channel && (
                      <span className="text-[10px] font-medium text-[#697386] bg-[#F0F4F8] px-2 py-0.5 rounded">
                        {step.channel}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status footer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 8 }}
          transition={{ duration: 0.4, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 flex items-center gap-2 border rounded-lg px-4 py-3"
          style={{ background: '#EBFAF3', borderColor: '#C3E8D5' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: '#1EA672' }} />
          <span className="text-xs font-semibold" style={{ color: '#0E7850' }}>Journey active</span>
          <span style={{ color: '#C3E8D5' }} className="mx-1">·</span>
          <span className="text-xs" style={{ color: '#1EA672' }}>Running for 12 customers in Slow Payers bucket</span>
        </motion.div>
      </div>

      {/* Cursor */}
      {cursorVisible && (
        <>
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{ left: '24%', top: 242 }}
            initial={{ x: 360, y: -195, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: cursorClicking ? 0.82 : 1 }}
            transition={
              cursorClicking
                ? { scale: { duration: 0.12, ease: 'easeOut' }, x: { duration: 0 }, y: { duration: 0 }, opacity: { duration: 0 } }
                : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <CursorSVG />
          </motion.div>

          {cursorClicking && (
            <motion.div
              key="ripple"
              className="absolute pointer-events-none z-40 rounded-full"
              style={{
                left: '24%', top: 242,
                width: 14, height: 14,
                marginLeft: -7, marginTop: -7,
                border: '2px solid #D97706',
              }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 4.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </>
      )}
    </div>
  );
}
