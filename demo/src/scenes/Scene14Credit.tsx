import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircleGauge from '../components/CircleGauge';

interface Props { isActive: boolean; }

const RECOMMENDATION_DELAY = 4500;

export default function Scene14Credit({ isActive }: Props) {
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowRecommendation(false);
      return;
    }
    const t = setTimeout(() => setShowRecommendation(true), RECOMMENDATION_DELAY);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 gap-5">
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[10px] font-semibold tracking-widest text-[#999999] uppercase"
      >
        Customer Credit Profile: Ratan Distributors
      </motion.div>

      {/* Before / Now cards */}
      <div className="flex items-center gap-5 w-full max-w-2xl">
        {/* Before card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 bg-white border border-[#E8E4DC] rounded-lg p-5"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
        >
          <div className="text-[10px] font-semibold tracking-widest text-[#999999] uppercase mb-3">Before: 6 Months Ago</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111111] mb-1">Avg delay: 18 days</div>
              <div className="text-xs text-[#777777]">Disputes: 1</div>
              <div className="text-xs text-[#777777] mt-0.5">Risk score: 42</div>
            </div>
            <CircleGauge value={42} color="#1EA672" size={72} strokeWidth={6} />
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl flex-shrink-0"
          style={{ color: '#E8E4DC' }}
        >
          →
        </motion.div>

        {/* Now card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 bg-white border-2 rounded-lg p-5"
          style={{
            borderColor: '#F9C4C7',
            boxShadow: '0 1px 3px 0 rgba(229,66,77,0.08)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#E5424D' }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#E5424D' }}>Now: Live</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#A81C26' }}>Avg delay: 31 days</div>
              <div className="text-xs" style={{ color: '#E5424D' }}>Disputes: 3</div>
              <div className="text-xs mt-0.5" style={{ color: '#E5424D' }}>Risk score: 71</div>
            </div>
            <CircleGauge value={71} color="#E5424D" size={72} strokeWidth={6} />
          </div>
        </motion.div>
      </div>

      {/* Recommendation card */}
      <AnimatePresence>
        {showRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-white border border-[#E8E4DC] rounded-lg p-5"
            style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-sm font-semibold text-[#111111]"
              >
                Monzy Recommendation: Next Cycle
              </motion.span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="text-xs text-[#999999] mb-4"
            >
              based on 14 months of interactions
            </motion.p>

            <div className="flex flex-col gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.45 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs text-[#777777] w-28">Credit limit:</span>
                <span className="font-mono text-sm line-through" style={{ color: '#999999' }}>₹5L</span>
                <span style={{ color: '#E8E4DC' }}>→</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.58, duration: 0.4 }}
                  className="font-mono text-sm font-semibold"
                  style={{ color: '#E5424D' }}
                >
                  ₹3.5L
                </motion.span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.54, duration: 0.45 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs text-[#777777] w-28">Credit period:</span>
                <span className="font-mono text-sm line-through" style={{ color: '#999999' }}>Net 45</span>
                <span style={{ color: '#E8E4DC' }}>→</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="font-mono text-sm font-semibold"
                  style={{ color: '#E5424D' }}
                >
                  Net 30
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
