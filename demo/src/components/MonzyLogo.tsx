import React from 'react';

interface MonzyLogoProps {
  size?: number;
  className?: string;
}

export default function MonzyLogo({ size = 28, className = '' }: MonzyLogoProps) {
  return (
    <div
      className={`flex items-center justify-center text-white font-semibold select-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.48,
        borderRadius: size * 0.22,
        background: '#635BFF',
        letterSpacing: '-0.01em',
      }}
    >
      M
    </div>
  );
}
