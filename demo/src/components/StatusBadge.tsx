import React from 'react';

type Variant = 'high' | 'medium' | 'low' | 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'purple' | 'grey' | 'whatsapp' | 'call' | 'email' | 'matched' | 'reconciled' | 'pdc' | 'unmatched';

interface StatusBadgeProps {
  label: string;
  variant: Variant;
  dot?: boolean;
  className?: string;
}

// Stripe-style badge colors: muted backgrounds, precise text colors, 4px radius
const STYLES: Record<Variant, string> = {
  high:       'bg-[#FDE8E9] text-[#A81C26]',
  medium:     'bg-[#FEF3C7] text-[#8A4F00]',
  low:        'bg-[#EBFAF3] text-[#0E7850]',
  green:      'bg-[#EBFAF3] text-[#0E7850]',
  blue:       'bg-[#E8F4FD] text-[#1A6CA8]',
  yellow:     'bg-[#FEF3C7] text-[#8A4F00]',
  orange:     'bg-[#FFF3E8] text-[#9A3D0C]',
  red:        'bg-[#FDE8E9] text-[#A81C26]',
  purple:     'bg-[#FDF6E8] text-[#7A5A1E]',
  grey:       'bg-[#F0EDE6] text-[#777777]',
  whatsapp:   'bg-[#EBFAF3] text-[#0E7850]',
  call:       'bg-[#F0EDE6] text-[#555555]',
  email:      'bg-[#F0EDE6] text-[#555555]',
  matched:    'bg-[#EBFAF3] text-[#0E7850]',
  reconciled: 'bg-[#FDF6E8] text-[#7A5A1E]',
  pdc:        'bg-[#FEF3C7] text-[#8A4F00]',
  unmatched:  'bg-[#FDE8E9] text-[#A81C26]',
};

export default function StatusBadge({ label, variant, dot, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium leading-4 ${STYLES[variant]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {label}
    </span>
  );
}
