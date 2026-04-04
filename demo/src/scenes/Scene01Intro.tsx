import React from 'react';
import { motion } from 'framer-motion';
import MonzyLogo from '../components/MonzyLogo';

interface Props { isActive: boolean; }

export default function Scene01Intro({ isActive }: Props) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-96 h-96 rounded-full blur-3xl opacity-30 absolute -top-10 -left-20"
          style={{ background: '#E0DEFF' }} />
        <div className="w-80 h-80 rounded-full blur-3xl opacity-20 absolute bottom-10 right-10"
          style={{ background: '#E8F4FD' }} />
        <div className="w-64 h-64 rounded-full blur-3xl opacity-15 absolute top-20 right-32"
          style={{ background: '#EBFAF3' }} />
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-8 gap-5">
        {/* Monzy branding — above headline */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <MonzyLogo size={32} />
          <span className="text-xl font-semibold text-[#1A1F36] tracking-tight">Monzy</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl font-semibold text-[#1A1F36] tracking-tight leading-tight max-w-xl"
        >
          Your AI Accounts Receivables Specialist.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-[#697386] font-normal max-w-lg leading-relaxed"
        >
          AI agents that automate AR collections and cash applications without your team lifting a finger.
        </motion.p>
      </div>
    </div>
  );
}
