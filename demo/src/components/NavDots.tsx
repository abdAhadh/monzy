import React from 'react';
import { motion } from 'framer-motion';

interface NavDotsProps {
  total: number;
  active: number;
  onSelect: (index: number) => void;
}

export default function NavDots({ total, active, onSelect }: NavDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative w-4 h-4 flex items-center justify-center group"
          title={`Section ${i + 1}`}
        >
          <motion.div
            animate={{
              width: i === active ? 16 : 5,
              height: 5,
              backgroundColor: i === active ? '#635BFF' : '#C8D4E0',
              borderRadius: 3,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </button>
      ))}
    </div>
  );
}
