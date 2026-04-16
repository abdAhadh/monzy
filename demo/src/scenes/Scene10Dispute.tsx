import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from '../components/ChatBubble';

export type DisputeVariant = 'chat' | 'detected' | 'routed' | 'resolved';

interface Props {
  isActive: boolean;
  variant: DisputeVariant;
}

function TypingIndicator() {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-emerald-500 rounded-2xl rounded-br-sm px-3 py-2 flex items-center gap-1">
        {[0, 0.2, 0.4].map((d, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-200"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, delay: d, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

const CHECKLIST = [
  { label: 'Detected', key: 'detected' },
  { label: 'Routed', key: 'routed' },
  { label: 'Resolved', key: 'resolved' },
  { label: 'Updated invoice sent', key: 'invoice' },
];

const VARIANT_STEPS: Record<DisputeVariant, string[]> = {
  chat: [],
  detected: ['detected'],
  routed: ['detected', 'routed'],
  resolved: ['detected', 'routed', 'resolved', 'invoice'],
};

function ChecklistItem({ label, done, delay = 0 }: { label: string; done: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-2 py-1.5"
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.span
            key="done"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"
          >
            <span className="text-emerald-600 text-[10px]">✓</span>
          </motion.span>
        ) : (
          <span key="pending" className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
        )}
      </AnimatePresence>
      <span className={`text-xs ${done ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>{label}</span>
    </motion.div>
  );
}

export default function Scene10Dispute({ isActive, variant }: Props) {
  const showTyping = variant === 'chat';
  const showRightPanel = variant !== 'chat';
  const steps = VARIANT_STEPS[variant];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: Chat panel */}
      <div className="flex-[38] flex flex-col border-r border-gray-100 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-emerald-600">
          <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-xs font-bold text-white">R</div>
          <div>
            <div className="text-xs font-semibold text-white">Ratan Distributors</div>
            <div className="text-[10px] text-emerald-200">WhatsApp</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-3 bg-[#ECE5DD]">
          <ChatBubble
            message="Hi Ratan team, a quick follow-up on Invoice #2847 for ₹3,87,000 due 32 days ago. Please share your payment timeline."
            time="10:02 AM"
            isAgent
            ticks="✓✓"
            delay={0.1}
          />

          {(variant !== 'chat' || true) && (
            <ChatBubble
              message="We received 180 units but invoice says 200. Can't process payment until this is resolved."
              time="10:18 AM"
              isAgent={false}
              delay={0.5}
            />
          )}

          {showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <TypingIndicator />
            </motion.div>
          )}

          {/* Resolved message */}
          {variant === 'resolved' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ChatBubble
                message="Updated invoice #2847-R attached  ₹3,52,400"
                time="10:22 AM"
                isAgent
                ticks="✓✓"
                delay={0}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Right: Dispute panel */}
      <div className="flex-[62] flex flex-col overflow-auto bg-gray-50/50 p-4 gap-3">
        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-red-600">Dispute</span>
                <span className="font-mono text-xs text-gray-500">#INV-2847</span>
              </div>
              <div className="text-xs text-gray-700 font-semibold mb-1">Ratan Distributors</div>
              <div className="font-mono text-lg font-bold text-[#A87C28] mb-2">₹3,87,000</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-gray-500">Type:</span>
                <span className="text-[10px] font-semibold text-orange-600">Quantity mismatch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Flagged by:</span>
                <span className="text-[10px] text-gray-700">Customer (WhatsApp)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Resolution Checklist</div>
              <div className="divide-y divide-gray-50">
                {CHECKLIST.map((item, i) => (
                  <ChecklistItem
                    key={item.key}
                    label={item.label}
                    done={steps.includes(item.key)}
                    delay={i * 0.1}
                  />
                ))}
              </div>

              {variant === 'resolved' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 pt-2 border-t border-gray-100"
                >
                  <div className="text-xs text-[#A87C28] font-medium">→ Awaiting payment</div>
                  <div className="text-[10px] text-gray-400 mt-1 italic">Resolved in 4 hrs — zero AR team involvement</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Routing card */}
        <AnimatePresence>
          {(variant === 'routed' || variant === 'resolved') && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Routing Logic</div>
              <div className="text-xs text-gray-700 mb-2">
                Quantity mismatch → <span className="font-semibold">Ops / Warehouse team</span>
              </div>
              <div className="bg-[#FDF6E8] border border-[#E8D5A0] rounded-lg px-3 py-2 mb-2">
                <span className="text-xs font-semibold text-[#7A5A1E]">@Priya (Warehouse)</span>
                <span className="text-xs text-[#A87C28]"> tagged in dispute</span>
                <div className="text-[10px] text-[#C49A3A] mt-0.5">Invoice #2847 — Ratan Dist. — qty mismatch</div>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="text-xs font-semibold text-[#7A5A1E] mb-0.5">Priya (Warehouse)</div>
                <div className="text-xs text-gray-700 italic">"Confirmed — 180 units dispatched. Billing error."</div>
              </div>

              {variant === 'routed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-1.5 mt-2"
                >
                  {[0, 0.2, 0.4].map((d, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#C49A3A]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, delay: d, repeat: Infinity }}
                    />
                  ))}
                  <span className="text-[10px] text-[#A87C28]">Ratio updating invoice...</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
