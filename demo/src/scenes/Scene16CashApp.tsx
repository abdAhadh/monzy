import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';

interface Props { isActive: boolean; }

const T = {
  CURSOR_APPEAR: 3200,
  CURSOR_CLICK:  4800,
  SLACK_APPEAR:  5300,
};

const ROWS = [
  {
    type: 'NEFT',
    amount: '₹3,52,400',
    ref: 'Ratan',
    note: 'no invoice ref',
    matched: 'INV-2847-R',
    status: 'Matched',
    statusVariant: 'matched' as const,
    unmatched: false,
  },
  {
    type: 'UPI',
    amount: '₹88,000',
    ref: 'MF Apr pymt',
    note: 'partial ref',
    matched: 'INV-2901 · Mehta Foods',
    status: 'Matched',
    statusVariant: 'matched' as const,
    unmatched: false,
  },
  {
    type: 'NEFT',
    amount: '₹1,08,000',
    ref: 'Sharma Trdrs',
    note: 'TDS deducted',
    matched: 'INV-2855',
    status: 'Reconciled',
    statusVariant: 'reconciled' as const,
    unmatched: false,
  },
  {
    type: 'CHEQ',
    amount: '₹2,40,000',
    ref: 'Kapoor Ent.',
    note: 'PDC · 5 Apr',
    matched: 'PDC logged',
    status: 'PDC Logged',
    statusVariant: 'pdc' as const,
    unmatched: false,
  },
  {
    type: 'NEFT',
    amount: '₹2,10,000',
    ref: 'N/A',
    note: 'unknown sender',
    matched: 'N/A',
    status: '⚠ Unmatched',
    statusVariant: 'unmatched' as const,
    unmatched: true,
  },
];

/* ── Cursor ──────────────────────────────────────────────────── */
function CursorSVG() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
      <path d="M3 2L3 21L8 16L11.5 23.5L14.5 22L11 14.5L18 14.5L3 2Z"
        fill="white" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ── ICICI Bank Logo ──────────────────────────────────────────── */
function ICICILogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <ellipse cx="14" cy="14" rx="13" ry="13" fill="white" fillOpacity="0.15"
          stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <text x="14" y="19" textAnchor="middle" fontFamily="Georgia, serif"
          fontSize="15" fontWeight="bold" fill="white">i</text>
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.12em', color: 'white' }}>ICICI</span>
        <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 400, fontSize: 8,
          letterSpacing: '0.25em', color: 'rgba(255,255,255,0.75)' }}>BANK</span>
      </div>
    </div>
  );
}

/* ── Slack Logo ───────────────────────────────────────────────── */
function SlackLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect x="13.5" y="1"  width="9" height="20" rx="4.5" fill="#36C5F0" />
      <rect x="1"    y="13.5" width="20" height="9" rx="4.5" fill="#2EB67D" />
      <rect x="13.5" y="15" width="9" height="20" rx="4.5" fill="#ECB22E" />
      <rect x="15"   y="13.5" width="20" height="9" rx="4.5" fill="#E01E5A" />
    </svg>
  );
}

/* ── Ananya avatar — Indian woman ────────────────────────────── */
function AnanyaAvatar({ size = 36 }: { size?: number }) {
  return (
    <div className="rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm"
      style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        {/* Skin background */}
        <rect width="60" height="60" fill="#C8845C" />
        {/* Clothing — teal kurta */}
        <ellipse cx="30" cy="66" rx="26" ry="18" fill="#0D9488" />
        {/* Dupatta hint */}
        <path d="M 10 52 Q 30 46 50 52" stroke="#5EEAD4" strokeWidth="3"
          strokeLinecap="round" fill="none" opacity="0.7" />
        {/* Neck */}
        <rect x="24" y="42" width="12" height="10" rx="5" fill="#C8845C" />
        {/* Hair — dark, sides and back */}
        <ellipse cx="30" cy="16" rx="16" ry="13" fill="#18080A" />
        <ellipse cx="13" cy="27" rx="6" ry="14" fill="#18080A" />
        <ellipse cx="47" cy="27" rx="6" ry="14" fill="#18080A" />
        {/* Face */}
        <ellipse cx="30" cy="29" rx="14" ry="15" fill="#D4895F" />
        {/* Forehead */}
        <ellipse cx="30" cy="19" rx="13" ry="7" fill="#D4895F" />
        {/* Bindi */}
        <circle cx="30" cy="20" r="2" fill="#DC2626" />
        {/* Left eye white */}
        <ellipse cx="23" cy="28" rx="3.8" ry="3" fill="white" />
        {/* Left iris */}
        <circle cx="23" cy="28.3" r="2.2" fill="#18080A" />
        {/* Left highlight */}
        <circle cx="23.8" cy="27.6" r="0.6" fill="white" opacity="0.85" />
        {/* Right eye white */}
        <ellipse cx="37" cy="28" rx="3.8" ry="3" fill="white" />
        {/* Right iris */}
        <circle cx="37" cy="28.3" r="2.2" fill="#18080A" />
        {/* Right highlight */}
        <circle cx="37.8" cy="27.6" r="0.6" fill="white" opacity="0.85" />
        {/* Eyebrows — strong, arched */}
        <path d="M 19 24.5 Q 23 22.5 27 24.5" stroke="#18080A"
          strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 33 24.5 Q 37 22.5 41 24.5" stroke="#18080A"
          strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Nose */}
        <ellipse cx="30" cy="33" rx="2.5" ry="1.8" fill="#B86A3C" opacity="0.4" />
        <circle cx="27.5" cy="33.5" r="0.9" fill="#A05028" opacity="0.55" />
        <circle cx="32.5" cy="33.5" r="0.9" fill="#A05028" opacity="0.55" />
        {/* Nose stud */}
        <circle cx="27.5" cy="33" r="0.75" fill="#F59E0B" />
        {/* Upper lip */}
        <path d="M 25 37 Q 27.5 35.5 30 36.2 Q 32.5 35.5 35 37 Q 32.5 38 30 37.5 Q 27.5 38 25 37 Z"
          fill="#A0482A" />
        {/* Lower lip */}
        <path d="M 25 37 Q 30 40.5 35 37 Q 32.5 38 30 37.5 Q 27.5 38 25 37 Z"
          fill="#C06040" />
        {/* Cheek blush subtle */}
        <ellipse cx="18" cy="31" rx="5" ry="3" fill="#E8785C" opacity="0.25" />
        <ellipse cx="42" cy="31" rx="5" ry="3" fill="#E8785C" opacity="0.25" />
      </svg>
    </div>
  );
}

/* ── Monzy bot icon ───────────────────────────────────────────── */
function MonzyBotAvatar() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: '#635BFF' }}>
      <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 11,
        color: 'white', letterSpacing: '-0.5px' }}>M</span>
    </div>
  );
}

/* ── Slack Notification ───────────────────────────────────────── */
function SlackNotification({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 bg-white border border-[#E3E8EF] rounded-lg overflow-hidden"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08)' }}
        >
          {/* Slack channel header */}
          <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ background: '#4A154B' }}>
            <SlackLogo size={18} />
            <span className="text-white text-xs font-bold">Slack</span>
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
            <span className="text-xs font-semibold" style={{ color: '#ECB22E' }}>#ar-team</span>
            <span className="ml-auto text-[10px] font-mono"
              style={{ color: 'rgba(255,255,255,0.4)' }}>sent via Monzy</span>
          </div>

          {/* Message body */}
          <div className="p-4 bg-white">
            <div className="flex gap-3">
              <MonzyBotAvatar />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[#1A1F36]">Monzy</span>
                  <span className="text-[10px] text-[#8792A2] font-mono">Today 10:33 AM</span>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border"
                    style={{ background: '#F0EFFF', borderColor: '#E0DEFF', color: '#635BFF' }}>APP</span>
                </div>

                <div className="text-xs leading-relaxed mb-3" style={{ color: '#425466' }}>
                  <span className="font-bold" style={{ color: '#E5424D' }}>⚠ Unmatched Payment Detected</span><br />
                  <span style={{ color: '#8792A2' }}>Amount:</span>{' '}
                  <span className="font-mono font-semibold" style={{ color: '#1A1F36' }}>₹2,10,000</span>{' '}
                  <span style={{ color: '#C8D4E0' }}>·</span>{' '}
                  <span style={{ color: '#8792A2' }}>Type: NEFT</span><br />
                  <span style={{ color: '#8792A2' }}>Ref:</span>{' '}
                  <span className="font-mono" style={{ color: '#697386' }}>Unknown sender · no invoice match found</span><br />
                  <br />
                  <span style={{ color: '#697386' }}>Hey </span>
                  <span className="font-semibold px-1 rounded" style={{ color: '#635BFF', background: '#F0EFFF' }}>@Ananya</span>
                  <span style={{ color: '#697386' }}> · please review and resolve before EOD.</span>
                </div>

                {/* Employee card */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-center gap-3 border rounded-lg px-3 py-2.5"
                  style={{ background: '#F6F9FC', borderColor: '#E3E8EF' }}
                >
                  <AnanyaAvatar size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#1A1F36]">Ananya Singh</div>
                    <div className="text-[10px] text-[#8792A2]">AR Manager · Accounts</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1EA672' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#1EA672' }}>Notified</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function Scene16CashApp({ isActive }: Props) {
  const [cursorVisible,  setCursorVisible]  = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [slackVisible,   setSlackVisible]   = useState(false);
  const [cursorTop, setCursorTop] = useState<number | null>(null);

  const sceneRef = useRef<HTMLDivElement>(null);

  // Measure unmatched row position via DOM query (works regardless of motion.div ref forwarding)
  useEffect(() => {
    const measure = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const badge = Array.from(scene.querySelectorAll('span')).find(
        s => s.textContent?.trim() === '⚠ Unmatched'
      );
      const row = badge?.closest('.flex.items-center') as HTMLElement | null;
      if (!row) return;
      const rowRect   = row.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const scrollEl  = scene.querySelector('.overflow-auto') as HTMLElement | null;
      setCursorTop(rowRect.top - sceneRect.top + rowRect.height / 2 + (scrollEl?.scrollTop ?? 0));
    };
    const t = setTimeout(measure, 500);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setCursorVisible(false);
      setCursorClicking(false);
      setSlackVisible(false);
      return;
    }
    const t1 = setTimeout(() => setCursorVisible(true),  T.CURSOR_APPEAR);
    const t2 = setTimeout(() => setCursorClicking(true), T.CURSOR_CLICK);
    const t3 = setTimeout(() => setSlackVisible(true),   T.SLACK_APPEAR);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isActive]);

  return (
    <div ref={sceneRef} className="flex-1 flex flex-col overflow-hidden relative bg-transparent">
      {/* Page header */}
      <div className="flex-1 overflow-auto px-6 py-4">

        {/* ICICI Bank header card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl overflow-hidden mb-4 shadow-sm border border-red-200"
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ background: '#8C1B1B' }}>
            <ICICILogo />
            <div className="text-right">
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Current Account</div>
              <div className="font-mono text-xs font-bold text-white tracking-wider">XXXX XXXX 7842</div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-b"
            style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}>
            <div className="text-xs" style={{ color: '#7F1D1D' }}>
              <span className="font-semibold">Available Balance: </span>
              <span className="font-mono font-bold">₹18,42,350.00</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: '#B91C1C' }}>As of 10:12 AM today</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-[#8792A2] font-mono">Monzy connected · pulling transactions live</span>
          </div>
        </motion.div>

        {/* Transaction table */}
        <div className="bg-white border border-[#E3E8EF] rounded-lg overflow-hidden"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}>
          <div className="flex items-center px-4 py-2.5 border-b border-[#E3E8EF]
            text-[10px] font-semibold text-[#8792A2] uppercase tracking-widest"
            style={{ background: '#F6F9FC' }}>
            <span className="w-14">Type</span>
            <span className="w-28">Amount</span>
            <span className="w-28">Reference</span>
            <span className="flex-1">Note</span>
            <span className="w-40">Matched To</span>
            <span className="w-28 text-right">Status</span>
          </div>

          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-center px-4 py-3 border-b border-[#F0F4F8] last:border-0
                transition-colors duration-300 ${
                row.unmatched
                  ? cursorClicking
                    ? 'bg-red-100 border-l-4 border-l-red-500'
                    : 'bg-red-50 border-l-4 border-l-red-400'
                  : ''
              }`}
            >
              {/* Click flash on unmatched row */}
              <AnimatePresence>
                {row.unmatched && cursorClicking && (
                  <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.05 }}
                    className="absolute inset-0 bg-red-200 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <span className="w-14 font-mono text-xs font-bold"
                style={{ color: row.unmatched ? '#E5424D' : '#635BFF' }}>{row.type}</span>
              <span className="w-28 font-mono text-xs font-semibold"
                style={{ color: row.unmatched ? '#A81C26' : '#1A1F36' }}>{row.amount}</span>
              <span className="w-28 font-mono text-xs text-[#697386]">{row.ref}</span>
              <span className="flex-1 text-xs text-[#8792A2]">{row.note}</span>
              <span className="w-40 text-xs text-[#697386] font-medium">{row.matched}</span>
              <span className="w-28 flex justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 + 0.5, duration: 0.3 }}
                >
                  <StatusBadge label={row.status} variant={row.statusVariant} />
                </motion.div>
              </span>
            </motion.div>
          ))}
        </div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-between mt-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1EA672' }} />
            <span className="text-xs font-medium text-[#425466]">
              Auto-matched: <span className="font-mono font-bold text-[#1A1F36]">4 / 5</span> payments
            </span>
          </div>
          <span className="text-xs text-[#8792A2] italic">
            Human only intervenes when machine can't resolve it.
          </span>
        </motion.div>

        {/* Slack notification */}
        <SlackNotification visible={slackVisible} />
      </div>

      {/* Cursor — moves from lower-right toward the unmatched row */}
      {cursorVisible && cursorTop !== null && (
        <>
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{ left: '28%', top: cursorTop }}
            initial={{ x: 120, y: 80, opacity: 0 }}
            animate={{
              x: 0, y: 0, opacity: 1,
              scale: cursorClicking ? 0.82 : 1,
            }}
            transition={
              cursorClicking
                ? { scale: { duration: 0.12, ease: 'easeOut' }, x: { duration: 0 }, y: { duration: 0 }, opacity: { duration: 0 } }
                : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <CursorSVG />
          </motion.div>

          {cursorClicking && (
            <motion.div
              key="ripple"
              className="absolute pointer-events-none z-40 rounded-full"
              style={{
                left: '28%', top: cursorTop,
                width: 14, height: 14,
                marginLeft: -7, marginTop: -7,
                border: '2px solid #EF4444',
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
