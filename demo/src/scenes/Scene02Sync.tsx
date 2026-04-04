import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props { isActive: boolean; }

const INTEGRATIONS = [
  { name: 'Tally',          logo: '/logos/tally.svg',      color: '#ED1C24' },
  { name: 'Zoho Books',     logo: '/logos/zoho-books.svg', color: '#226DB4' },
  { name: 'SAP',            logo: '/logos/sap.svg',        color: '#1870C5' },
  { name: 'QuickBooks',     logo: '/logos/quickbooks.svg', color: '#2CA01C' },
  { name: 'Razorpay',       logo: '/logos/razorpay.svg',   color: '#3395FF' },
  { name: 'Oracle NetSuite',logo: '/logos/netsuite.svg',   color: '#E41817' },
];

function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toLocaleString('en-IN')}</>;
}

function TilesContent() {
  return (
    <>
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#8792A2]">
        Connecting to your existing tools
      </p>
      <div className="grid grid-cols-3 gap-4" style={{ width: 520 }}>
        {INTEGRATIONS.map((intg, i) => (
          <motion.div
            key={intg.name}
            initial={{ opacity: 0, y: 18, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07 + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-[#E3E8EF] rounded-xl flex flex-col items-center justify-center gap-3"
            style={{ height: 120, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
          >
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 92, height: 36, background: '#F6F9FC', border: '1px solid #E3E8EF' }}
            >
              <img src={intg.logo} alt={intg.name} style={{ maxWidth: 76, maxHeight: 28, objectFit: 'contain' }} />
            </div>
            <span className="text-xs font-medium text-[#425466] text-center leading-tight px-2">
              {intg.name}
            </span>
            <motion.div
              className="h-0.5 rounded-full overflow-hidden"
              style={{ width: 56, background: '#E0DEFF' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.09 + 0.3, duration: 0.7, ease: 'easeOut' }}
            />
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-[#8792A2] text-center">....and many more.</p>
    </>
  );
}

function StatsContent() {
  return (
    <>
      {/* Chips row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap justify-center gap-2"
      >
        {INTEGRATIONS.map((intg, i) => (
          <motion.div
            key={intg.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-1.5 bg-white border border-[#E3E8EF] rounded px-2.5 py-1.5"
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 16 }}>
              <img src={intg.logo} alt={intg.name} style={{ maxWidth: 44, maxHeight: 14, objectFit: 'contain' }} />
            </div>
            <span className="text-[11px] text-[#425466] font-medium whitespace-nowrap">{intg.name}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats cards */}
      <div className="flex items-stretch gap-4 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 bg-white border border-[#E3E8EF] rounded-xl px-6 py-6 flex flex-col items-center gap-1"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
        >
          <span className="text-[52px] font-semibold leading-none text-[#1A1F36] tabular-nums">
            <CountUp to={847} />
          </span>
          <span className="text-[10px] text-[#8792A2] font-semibold mt-2 tracking-widest uppercase">invoices synced</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 bg-white border border-[#E3E8EF] rounded-xl px-6 py-6 flex flex-col items-center gap-1"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
        >
          <span className="text-[52px] font-semibold leading-none text-[#1A1F36] tabular-nums">
            <CountUp to={214} />
          </span>
          <span className="text-[10px] text-[#8792A2] font-semibold mt-2 tracking-widest uppercase">customers loaded</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 bg-white border rounded-xl px-6 py-6 flex flex-col items-center gap-1"
          style={{
            borderColor: '#C8C4FF',
            boxShadow: '0 0 0 1px #E0DEFF, 0 1px 3px 0 rgba(99,91,255,0.08)',
          }}
        >
          <div className="flex items-baseline gap-0.5 whitespace-nowrap leading-none">
            <span className="text-[28px] font-semibold leading-none" style={{ color: '#635BFF' }}>₹</span>
            <span className="text-[52px] font-semibold leading-none tabular-nums" style={{ color: '#635BFF' }}>4.2</span>
            <span className="text-[22px] font-semibold leading-none ml-1" style={{ color: '#8F8BFF' }}>Cr</span>
          </div>
          <span className="text-[10px] text-[#8792A2] font-semibold mt-2 tracking-widest uppercase">outstanding imported</span>
        </motion.div>
      </div>

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#1EA672' }} />
        <span className="text-sm font-medium" style={{ color: '#1EA672' }}>Live sync active</span>
      </motion.div>
    </>
  );
}

export default function Scene02Sync({ isActive }: Props) {
  const [phase, setPhase] = useState<'tiles' | 'stats'>('tiles');
  const [statsReady, setStatsReady] = useState(false);
  const [tileKey, setTileKey] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase('tiles');
      setStatsReady(false);
      return;
    }
    setTileKey(k => k + 1);
    const t = setTimeout(() => {
      setStatsReady(true);
      setPhase('stats');
    }, 4000);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <motion.div
        animate={{ opacity: phase === 'tiles' ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-12"
        style={{ pointerEvents: phase === 'tiles' ? 'auto' : 'none' }}
      >
        <TilesContent key={tileKey} />
      </motion.div>

      {statsReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'stats' ? 1 : 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-12"
          style={{ pointerEvents: phase === 'stats' ? 'auto' : 'none' }}
        >
          <StatsContent />
        </motion.div>
      )}
    </div>
  );
}
