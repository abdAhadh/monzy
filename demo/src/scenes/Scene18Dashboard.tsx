import React from 'react';
import { motion } from 'framer-motion';
import ActivityFeed from '../components/ActivityFeed';

interface Props { isActive: boolean; }

const METRICS = [
  {
    label: 'Outstanding',
    before: '₹4.2 Cr',
    after: '₹1.8 Cr',
    afterColor: '#635BFF',
  },
  {
    label: 'Overdue',
    before: '₹87L',
    after: '₹19L',
    afterColor: '#E68C2F',
  },
  {
    label: 'At Risk',
    before: '₹34L',
    after: '₹6L',
    afterColor: '#1EA672',
  },
  {
    label: 'Disputes Open',
    before: '4',
    after: '0',
    afterColor: '#1EA672',
  },
];

const FEED_ITEMS = [
  { time: '10:02', action: 'WhatsApp sent', entity: 'Ratan Distributors', status: 'delivered', statusColor: 'green' as const },
  { time: '10:04', action: 'Voice call', entity: 'Kapoor Enterprises', status: 'completed', statusColor: 'green' as const },
  { time: '10:06', action: 'Email sent', entity: 'Mehta Foods', status: 'delivered', statusColor: 'green' as const },
  { time: '10:06', action: 'AR updated', entity: 'Kapoor Enterprises', status: 'done', statusColor: 'blue' as const },
  { time: '10:18', action: 'Dispute detected', entity: 'Ratan Distributors', status: 'resolved', statusColor: 'green' as const },
  { time: '10:22', action: 'Invoice updated', entity: 'Ratan Dist.', status: 'sent', statusColor: 'blue' as const },
  { time: '10:31', action: 'Payment matched', entity: '₹3,52,400', status: 'matched', statusColor: 'green' as const },
  { time: '10:33', action: 'TDS reconciled', entity: '₹12,000', status: 'done', statusColor: 'green' as const },
  { time: '10:35', action: 'PDC logged', entity: 'Kapoor Ent.', status: 'set', statusColor: 'blue' as const },
];

export default function Scene18Dashboard({ isActive }: Props) {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Left: metrics */}
          <div className="flex-[60] overflow-auto p-4 flex flex-col gap-3">
            {/* Metric cards 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-[#E3E8EF] rounded-lg px-4 py-3.5"
                  style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}
                >
                  <div className="text-[10px] font-semibold text-[#8792A2] uppercase tracking-widest mb-2">{m.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm line-through" style={{ color: '#8792A2' }}>{m.before}</span>
                    <span className="text-xs" style={{ color: '#E3E8EF' }}>→</span>
                    <span className="font-mono text-xl font-semibold" style={{ color: m.afterColor }}>{m.after}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 border rounded px-3 py-2"
              style={{ background: '#FEF3C7', borderColor: '#FDE08A' }}
            >
              <span className="text-xs" style={{ color: '#D97706' }}>⚠</span>
              <span className="text-xs" style={{ color: '#8A4F00' }}>Unmatched: 1 (flagged · AR manager notified)</span>
            </motion.div>
          </div>

          {/* Right: Activity feed */}
          <div className="flex-[40] border-l border-[#E3E8EF] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E3E8EF] bg-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1EA672' }} />
              <span className="text-xs font-medium text-[#1A1F36]">Monzy still working...</span>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <ActivityFeed items={FEED_ITEMS} startDelay={0.2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
