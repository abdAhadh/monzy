import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props { isActive: boolean; }

const CUSTOMERS = [
  { name: 'Tata Consultancy Services', days: '3 days',   bucket: 0 },
  { name: 'Tata Motors Ltd',           days: '32 days',  bucket: 1 },
  { name: 'Bharat Forge Ltd',          days: '65 days',  bucket: 2 },
  { name: 'Infosys Ltd',               days: '5 days',   bucket: 0 },
  { name: 'Cox & Kings Ltd',           days: '102 days', bucket: 3 },
  { name: 'ITC Ltd',                   days: '35 days',  bucket: 1 },
  { name: 'Wipro Ltd',                 days: '8 days',   bucket: 0 },
  { name: 'DHFL Housing Finance',      days: '118 days', bucket: 3 },
  { name: 'Hindustan Unilever',        days: '34 days',  bucket: 1 },
  { name: 'HCL Technologies',          days: '7 days',   bucket: 0 },
  { name: 'Motherson Sumi Systems',    days: '57 days',  bucket: 2 },
  { name: 'Godrej Industries',         days: '28 days',  bucket: 1 },
  { name: 'Larsen & Toubro Ltd',       days: '3 days',   bucket: 0 },
  { name: 'Sundaram Finance',          days: '62 days',  bucket: 2 },
  { name: 'Nestle India Ltd',          days: '31 days',  bucket: 1 },
  { name: 'Bajaj Auto Ltd',            days: '4 days',   bucket: 0 },
  { name: 'Amtek Auto Ltd',            days: '63 days',  bucket: 2 },
  { name: 'Gitanjali Gems',            days: '94 days',  bucket: 3 },
  { name: 'Marico Ltd',               days: '30 days',  bucket: 1 },
  { name: 'Maruti Suzuki India',       days: '7 days',   bucket: 0 },
  { name: 'Tech Mahindra Ltd',         days: '6 days',   bucket: 0 },
  { name: 'Emami Ltd',                days: '33 days',  bucket: 1 },
  { name: 'Escorts Ltd',              days: '59 days',  bucket: 2 },
  { name: 'Asian Paints Ltd',          days: '6 days',   bucket: 0 },
  { name: 'Colgate-Palmolive India',   days: '29 days',  bucket: 1 },
  { name: 'Dabur India Ltd',           days: '8 days',   bucket: 0 },
  { name: 'Ramkrishna Forgings',       days: '68 days',  bucket: 2 },
  { name: 'Jyothy Labs Ltd',           days: '36 days',  bucket: 1 },
  { name: 'Mphasis Ltd',              days: '9 days',   bucket: 0 },
  { name: 'Sterling Biotech',          days: '135 days', bucket: 3 },
  { name: 'Britannia Industries',      days: '37 days',  bucket: 1 },
  { name: 'Persistent Systems',        days: '4 days',   bucket: 0 },
  { name: 'Wabco India Ltd',           days: '60 days',  bucket: 2 },
  { name: 'Kansai Nerolac Paints',     days: '28 days',  bucket: 1 },
  { name: 'Hexaware Technologies',     days: '7 days',   bucket: 0 },
  { name: 'Mahindra Finance Ltd',      days: '5 days',   bucket: 0 },
  { name: 'Pidilite Industries',       days: '5 days',   bucket: 0 },
  { name: 'GlaxoSmithKline India',     days: '30 days',  bucket: 1 },
  { name: 'Zensar Technologies',       days: '8 days',   bucket: 0 },
  { name: 'Berger Paints India',       days: '7 days',   bucket: 0 },
  { name: 'Sundaram-Clayton Ltd',      days: '5 days',   bucket: 0 },
];

const DISPLAY_CUSTOMERS = [...CUSTOMERS, ...CUSTOMERS.slice(0, 22)];

// Stripe-aligned palette for buckets
const BUCKET_COLORS = [
  { dot: '#1EA672', text: '#0E7850', bg: '#EBFAF3', border: '#C3E8D5' },
  { dot: '#D97706', text: '#92510B', bg: '#FEF3C7', border: '#FDE08A' },
  { dot: '#E68C2F', text: '#9A3D0C', bg: '#FFF3E8', border: '#FFD0A0' },
  { dot: '#E5424D', text: '#A81C26', bg: '#FDE8E9', border: '#F9C4C7' },
];

const BUCKETS = [
  { label: 'BUCKET A', name: 'Reliable',    customers: '18 customers', delay: 'avg delay: 8 days',   ...BUCKET_COLORS[0] },
  { label: 'BUCKET B', name: 'Slow Payers', customers: '12 customers', delay: 'avg delay: 34 days',  ...BUCKET_COLORS[1] },
  { label: 'BUCKET C', name: 'At Risk',     customers: '7 customers',  delay: 'avg delay: 61 days',  ...BUCKET_COLORS[2] },
  { label: 'BUCKET D', name: 'Defaulters',  customers: '4 customers',  delay: 'avg delay: 90+ days', ...BUCKET_COLORS[3] },
];

const ROW_H          = 44;
const SCROLL_DIST    = 800;
const SCROLL_DURATION = 3.0;
const PHASE_SWITCH_MS = 3300;
const CURSOR_APPEAR_MS = 5100;
const CURSOR_CLICK_MS  = 6300;

function CursorSVG() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
      <path d="M3 2L3 21L8 16L11.5 23.5L14.5 22L11 14.5L18 14.5L3 2Z"
        fill="white" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CustomerListLayer({ listKey }: { listKey: number }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative overflow-hidden flex-1" style={{ minHeight: 0 }}>
        <motion.div
          key={listKey}
          initial={{ y: 0 }}
          animate={{ y: -SCROLL_DIST }}
          transition={{ duration: SCROLL_DURATION, ease: 'linear', delay: 0.1 }}
        >
          {DISPLAY_CUSTOMERS.map((c, i) => (
            <div
              key={i}
              className="flex items-center px-6 border-b border-[#F0EDE6] bg-white"
              style={{ height: ROW_H }}
            >
              <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: BUCKET_COLORS[c.bucket].dot }} />
              <span className="flex-1 text-sm text-[#111111] font-medium truncate">{c.name}</span>
              <span className="text-xs font-medium ml-3 flex-shrink-0"
                style={{ color: BUCKET_COLORS[c.bucket].text }}>{c.days}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function BucketCardsLayer({ clickingBucket }: { clickingBucket: number }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          {BUCKETS.map((bucket, i) => {
            const fromLeft = i === 0 || i === 2;
            const isClicking = clickingBucket === i;
            return (
              <motion.div
                key={bucket.label}
                initial={{ opacity: 0, x: fromLeft ? -20 : 20, scale: 0.95 }}
                animate={
                  isClicking
                    ? { opacity: 1, x: 0, scale: 0.97, boxShadow: `0 0 0 2px ${bucket.dot}` }
                    : { opacity: 1, x: 0, scale: 1,    boxShadow: '0 0 0 0px transparent' }
                }
                transition={
                  isClicking
                    ? { duration: 0.12, ease: 'easeOut' }
                    : { duration: 0.5, delay: i * 0.07 + 0.15, ease: [0.22, 1, 0.36, 1] }
                }
                className="relative rounded-lg p-4 border"
                style={{ backgroundColor: bucket.bg, borderColor: bucket.border }}
              >
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ backgroundColor: bucket.dot }} />
                <div className="text-[10px] font-semibold tracking-widest mb-1.5" style={{ color: bucket.text }}>
                  {bucket.label}
                </div>
                <div className="text-sm font-semibold text-[#111111] mb-1.5">{bucket.name}</div>
                <div className="text-xs text-[#555555]">{bucket.customers}</div>
                <div className="text-xs mt-0.5" style={{ color: bucket.text }}>{bucket.delay}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Scene03Segmentation({ isActive }: Props) {
  const [phase, setPhase]               = useState<'list' | 'buckets'>('list');
  const [bucketsReady, setBucketsReady] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [listKey, setListKey]           = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase('list');
      setBucketsReady(false);
      setCursorVisible(false);
      setCursorClicking(false);
      return;
    }
    setListKey(k => k + 1);
    const t1 = setTimeout(() => { setBucketsReady(true); setPhase('buckets'); }, PHASE_SWITCH_MS);
    const t2 = setTimeout(() => { setCursorVisible(true); },  CURSOR_APPEAR_MS);
    const t3 = setTimeout(() => { setCursorClicking(true); }, CURSOR_CLICK_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isActive]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <motion.div
        animate={
          phase === 'list'
            ? { x: 0, scale: 1, opacity: 1 }
            : { x: -32, scale: 0.97, opacity: 0 }
        }
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
        style={{ pointerEvents: phase === 'list' ? 'auto' : 'none', transformOrigin: 'left center' }}
      >
        <CustomerListLayer listKey={listKey} />
      </motion.div>

      {bucketsReady && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: phase === 'buckets' ? 0 : '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ pointerEvents: phase === 'buckets' ? 'auto' : 'none' }}
        >
          <BucketCardsLayer clickingBucket={cursorClicking ? 1 : -1} />
        </motion.div>
      )}

      {cursorVisible && (
        <>
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{ left: '72%', top: 77 }}
            initial={{ x: -230, y: 270, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: cursorClicking ? 0.82 : 1 }}
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
                left: '72%', top: 77,
                width: 14, height: 14,
                marginLeft: -7, marginTop: -7,
                border: '2px solid #D97706',
              }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 4.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          )}
        </>
      )}
    </div>
  );
}
