import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  time: string;
  isAgent?: boolean;
  ticks?: '✓' | '✓✓';
  delay?: number;
}

export default function ChatBubble({ message, time, isAgent = false, ticks, delay = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl ${
          isAgent
            ? 'bg-emerald-500 text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="text-xs leading-relaxed">{message}</p>
        <div className={`flex items-center gap-1 mt-0.5 ${isAgent ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isAgent ? 'text-emerald-100' : 'text-gray-400'}`}>{time}</span>
          {ticks && <span className={`text-[10px] ${isAgent ? 'text-emerald-200' : 'text-gray-400'}`}>{ticks}</span>}
        </div>
      </div>
    </motion.div>
  );
}
