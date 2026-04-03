import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';

interface Props { isActive: boolean; }

const T = {
  CURSOR_APPEAR: 2600,
  CURSOR_CLICK:  4000,
};

const ROWS = [
  {
    company: 'Ratan Distributors',
    amount: '₹3,87,000',
    channel: 'WhatsApp',
    channelVariant: 'whatsapp' as const,
    status: 'Commitment: Thu',
    statusVariant: 'green' as const,
    risk: 'Medium',
    riskVariant: 'medium' as const,
    update: '₹2,00,000 by Thursday · balance by month end',
  },
  {
    company: 'Kapoor Enterprises',
    amount: '₹1,20,000',
    channel: 'Call',
    channelVariant: 'call' as const,
    status: 'Expected: 3 Apr',
    statusVariant: 'green' as const,
    risk: 'Medium',
    riskVariant: 'medium' as const,
    update: 'Full payment within 7 days',
  },
  {
    company: 'Mehta Foods',
    amount: '₹88,000',
    channel: 'Email',
    channelVariant: 'email' as const,
    status: 'Expected: Apr 11',
    statusVariant: 'blue' as const,
    risk: 'Low',
    riskVariant: 'low' as const,
    update: 'Full payment confirmed · April 11',
  },
  {
    company: 'Global Exports Ltd.',
    amount: '₹2,45,000',
    channel: 'Dispute',
    channelVariant: 'orange' as const,
    status: 'Dispute Raised',
    statusVariant: 'orange' as const,
    risk: 'High',
    riskVariant: 'high' as const,
    update: 'Qty mismatch (200→180) · raised with Priya, Warehouse',
  },
];

function CursorSVG() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
      <path d="M3 2L3 21L8 16L11.5 23.5L14.5 22L11 14.5L18 14.5L3 2Z"
        fill="white" stroke="#1A1F36" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Scene08ARTable({ isActive }: Props) {
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCursorVisible(false);
      setCursorClicking(false);
      return;
    }
    const t1 = setTimeout(() => setCursorVisible(true),  T.CURSOR_APPEAR);
    const t2 = setTimeout(() => setCursorClicking(true), T.CURSOR_CLICK);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white border border-[#E3E8EF] rounded-lg overflow-hidden"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}>
          {/* Table header */}
          <div className="flex items-center px-4 py-2.5 border-b border-[#E3E8EF] text-[10px] font-semibold text-[#8792A2] uppercase tracking-widest"
            style={{ background: '#F6F9FC' }}>
            <span className="flex-[3]">Company</span>
            <span className="flex-[2] text-right">Amount</span>
            <span className="flex-[2] text-center">Channel</span>
            <span className="flex-[3] text-center">Status</span>
            <span className="flex-[2] text-center">Risk</span>
            <span className="flex-[5]">Last Update</span>
          </div>

          {ROWS.map((row, i) => {
            const isRatan = i === 0;
            return (
              <motion.div
                key={row.company}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-center px-4 py-3.5 border-b border-[#F0F4F8] last:border-0 transition-colors duration-150"
                style={cursorClicking && isRatan ? { backgroundColor: '#F0EFFF' } : {}}
              >
                {/* Highlight flash on click */}
                <AnimatePresence>
                  {cursorClicking && isRatan && (
                    <motion.div
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 1.0, delay: 0.1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: '#E0DEFF' }}
                    />
                  )}
                </AnimatePresence>
                <span className="flex-[3] text-xs font-medium text-[#1A1F36]">{row.company}</span>
                <span className="flex-[2] text-right font-mono text-xs font-semibold" style={{ color: '#635BFF' }}>{row.amount}</span>
                <span className="flex-[2] flex justify-center">
                  <StatusBadge label={row.channel} variant={row.channelVariant} />
                </span>
                <span className="flex-[3] flex justify-center">
                  <StatusBadge label={row.status} variant={row.statusVariant} />
                </span>
                <span className="flex-[2] flex justify-center">
                  <StatusBadge label={row.risk} variant={row.riskVariant} />
                </span>
                <span className="flex-[5] text-[11px] text-[#697386] pl-3">{row.update}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex items-center gap-2 mt-4"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#635BFF' }} />
          <span className="text-[10px] text-[#8792A2] font-mono">Updated by Monzy · based on WhatsApp, call, email and dispute data · 10:12 AM</span>
        </motion.div>
      </div>

      {/* Cursor */}
      {cursorVisible && (
        <>
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{ left: '22%', top: 86 }}
            initial={{ x: 120, y: 200, opacity: 0 }}
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
                left: '22%', top: 103,
                width: 14, height: 14,
                marginLeft: -7, marginTop: -7,
                border: '2px solid #635BFF',
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
