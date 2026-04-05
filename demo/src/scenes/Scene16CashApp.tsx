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
    <div className="bg-white rounded-md px-2 py-1 flex items-center">
      <img src="/logos/icici.svg" alt="ICICI Bank" style={{ height: 24, width: 'auto' }} />
    </div>
  );
}

/* ── Slack Logo ───────────────────────────────────────────────── */
function SlackLogo({ size = 18 }: { size?: number }) {
  return (
    <img src="/logos/slack.svg" alt="Slack" width={size} height={size} style={{ objectFit: 'contain' }} />
  );
}

/* ── Ananya avatar — real photo, head-cropped ────────────────── */
function AnanyaAvatar({ size = 36 }: { size?: number }) {
  return (
    <div className="rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm"
      style={{ width: size, height: size }}>
      <img
        src="/ananya.jpg"
        alt="Ananya Singh"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 8%',
        }}
      />
    </div>
  );
}

/* ── Monzy bot icon ───────────────────────────────────────────── */
function MonzyBotAvatar() {
  return (
    <svg width="32" height="32" viewBox="0 0 35 35" fill="none" className="flex-shrink-0 rounded-lg shadow-sm" style={{ borderRadius: 8 }}>
      <path d="M11.974 35C5.361 35 0 29.639 0 23.026V11.974C0 5.361 5.361 0 11.974 0H23.026C29.639 0 35 5.361 35 11.974V23.026C35 29.639 29.639 35 23.026 35H11.974Z" fill="#111111"/>
      <path d="M13.7021 15.125C16.7591 13.666 19.1901 11.156 20.5521 8.05396C19.6631 7.11996 18.5061 6.45296 17.2611 6.05296L16.5941 5.82996C16.5441 5.92696 16.5131 6.03296 16.5051 6.14096C15.4371 9.16696 13.2571 11.612 10.3231 12.991C8.27605 13.97 6.76405 15.749 6.05205 17.885L5.83105 18.551C5.92705 18.601 6.03305 18.631 6.14105 18.64C6.98705 18.951 7.83105 19.352 8.63205 19.842C9.78905 17.78 11.5621 16.13 13.7021 15.125ZM26.6031 15.304C24.9401 17.826 22.6161 19.841 19.8851 21.131C17.6181 22.199 15.8821 24.2 15.0821 26.602L14.8591 27.358C15.7231 28.124 16.7391 28.699 17.8401 29.048L18.5061 29.271C18.5571 29.174 18.5871 29.068 18.5961 28.959C19.6631 25.934 21.8431 23.488 24.7781 22.11C26.8241 21.131 28.3811 19.352 29.0491 17.216L29.2711 16.55C28.3371 16.283 27.4471 15.837 26.6031 15.304ZM13.0791 25.047C14.1871 22.37 16.2471 20.199 18.8621 18.952C21.2641 17.796 23.2651 16.018 24.6441 13.838C23.6211 12.859 22.7761 11.747 22.1541 10.413C20.4881 13.459 17.9041 15.903 14.7701 17.396C12.9461 18.241 11.4781 19.709 10.5881 21.488C11.5671 22.423 12.3681 23.579 12.9901 24.868L13.0791 25.047Z" fill="white"/>
    </svg>
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
          className="mt-4 bg-white border border-[#E8E4DC] rounded-lg overflow-hidden"
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
                  <span className="text-sm font-semibold text-[#111111]">Monzy</span>
                  <span className="text-[10px] text-[#999999] font-mono">Today 10:33 AM</span>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border"
                    style={{ background: '#FDF6E8', borderColor: '#F5E8C8', color: '#A87C28' }}>APP</span>
                </div>

                <div className="text-xs leading-relaxed mb-3" style={{ color: '#555555' }}>
                  <span className="font-bold" style={{ color: '#E5424D' }}>⚠ Unmatched Payment Detected</span><br />
                  <span style={{ color: '#999999' }}>Amount:</span>{' '}
                  <span className="font-mono font-semibold" style={{ color: '#111111' }}>₹2,10,000</span>{' '}
                  <span style={{ color: '#E8E4DC' }}>·</span>{' '}
                  <span style={{ color: '#999999' }}>Type: NEFT</span><br />
                  <span style={{ color: '#999999' }}>Ref:</span>{' '}
                  <span className="font-mono" style={{ color: '#777777' }}>Unknown sender · no invoice match found</span><br />
                  <br />
                  <span style={{ color: '#777777' }}>Hey </span>
                  <span className="font-semibold px-1 rounded" style={{ color: '#A87C28', background: '#FDF6E8' }}>@Ananya</span>
                  <span style={{ color: '#777777' }}> · please review and resolve before EOD.</span>
                </div>

                {/* Employee card */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-center gap-3 border rounded-lg px-3 py-2.5"
                  style={{ background: '#FAF9F6', borderColor: '#E8E4DC' }}
                >
                  <AnanyaAvatar size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#111111]">Ananya Singh</div>
                    <div className="text-[10px] text-[#999999]">AR Manager · Accounts</div>
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
            <span className="text-[10px] text-[#999999] font-mono">Monzy connected · pulling transactions live</span>
          </div>
        </motion.div>

        {/* Transaction table */}
        <div className="bg-white border border-[#E8E4DC] rounded-lg overflow-hidden"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}>
          <div className="flex items-center px-4 py-2.5 border-b border-[#E8E4DC]
            text-[10px] font-semibold text-[#999999] uppercase tracking-widest"
            style={{ background: '#FAF9F6' }}>
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
              className={`relative flex items-center px-4 py-3 border-b border-[#F0EDE6] last:border-0
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
                style={{ color: row.unmatched ? '#E5424D' : '#A87C28' }}>{row.type}</span>
              <span className="w-28 font-mono text-xs font-semibold"
                style={{ color: row.unmatched ? '#A81C26' : '#111111' }}>{row.amount}</span>
              <span className="w-28 font-mono text-xs text-[#777777]">{row.ref}</span>
              <span className="flex-1 text-xs text-[#999999]">{row.note}</span>
              <span className="w-40 text-xs text-[#777777] font-medium">{row.matched}</span>
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
            <span className="text-xs font-medium text-[#555555]">
              Auto-matched: <span className="font-mono font-bold text-[#111111]">4 / 5</span> payments
            </span>
          </div>
          <span className="text-xs text-[#999999] italic">
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
