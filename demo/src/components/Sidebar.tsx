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
    <div className="w-44 flex-shrink-0 border-r border-gray-100 bg-white/60 flex flex-col pt-4 pb-4 gap-0.5 px-2">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-default select-none ${
            item.active
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          <span className={`text-xs font-medium flex-1 ${item.active ? 'text-blue-700' : 'text-gray-600'}`}>
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
