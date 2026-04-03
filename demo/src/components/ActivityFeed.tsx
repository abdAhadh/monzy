import React from 'react';
import { motion } from 'framer-motion';

interface FeedItem {
  time: string;
  action: string;
  entity: string;
  status: string;
  statusColor?: 'green' | 'blue' | 'grey';
}

interface ActivityFeedProps {
  items: FeedItem[];
  startDelay?: number;
}

const STATUS_COLORS = {
  green: 'text-[#1EA672]',
  blue:  'text-[#635BFF]',
  grey:  'text-[#8792A2]',
};

export default function ActivityFeed({ items, startDelay = 0 }: ActivityFeedProps) {
  return (
    <div className="flex flex-col gap-0">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: startDelay + i * 0.18, ease: 'easeOut' }}
          className="flex items-center gap-2 px-3 py-1.5 border-b border-[#F0F4F8] hover:bg-[#F6F9FC] transition-colors"
        >
          <span className="font-mono text-[10px] text-[#8792A2] w-10 flex-shrink-0">{item.time}</span>
          <span className="text-xs text-[#1A1F36] w-28 flex-shrink-0 font-medium">{item.action}</span>
          <span className="text-xs text-[#697386] flex-1 truncate">{item.entity}</span>
          <span className={`text-[10px] font-medium flex-shrink-0 ${STATUS_COLORS[item.statusColor ?? 'grey']}`}>
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
