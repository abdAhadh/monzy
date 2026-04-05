import React from 'react';
import { motion } from 'framer-motion';

interface CircleGaugeProps {
  value: number; // 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
}

export default function CircleGauge({ value, color, size = 80, strokeWidth = 7 }: CircleGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#E8E4DC"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-semibold text-sm" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}
