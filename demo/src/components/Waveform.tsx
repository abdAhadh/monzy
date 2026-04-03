import React from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
  bars?: number;
  color?: string;
  height?: number;
}

const DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.2];
const DURATIONS = [0.7, 0.9, 0.65, 0.8, 0.75, 0.85, 0.7];

export default function Waveform({ bars = 7, color = '#2563EB', height = 32 }: WaveformProps) {
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          style={{ backgroundColor: color, width: 4, borderRadius: 2, originY: 1 }}
          animate={{
            height: [height * 0.2, height, height * 0.3, height * 0.8, height * 0.2],
          }}
          transition={{
            duration: DURATIONS[i % DURATIONS.length],
            delay: DELAYS[i % DELAYS.length],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
