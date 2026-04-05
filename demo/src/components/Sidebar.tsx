import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItem {
  label: string;
  icon: string;
  active?: boolean;
  hasGreenDot?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <div className="w-44 flex-shrink-0 border-r border-[#E8E4DC] bg-[#FAF9F6]/60 flex flex-col pt-4 pb-4 gap-0.5 px-2">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-default select-none ${
            item.active
              ? 'bg-[#FDF6E8] text-[#7A5A1E]'
              : 'text-[#777777] hover:bg-[#FAF9F6]'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          <span className={`text-xs font-medium flex-1 ${item.active ? 'text-[#7A5A1E]' : 'text-[#555555]'}`}>
            {item.label}
          </span>
          {item.hasGreenDot && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
