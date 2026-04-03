import React from 'react';
import { motion } from 'framer-motion';
import MonzyLogo from '../components/MonzyLogo';

interface Props { isActive: boolean; }

export default function Scene01Intro({ isActive }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full blur-3xl opacity-30 absolute -top-10 -left-20"
          style={{ background: '#E0DEFF' }} />
        <div className="w-80 h-80 rounded-full blur-3xl opacity-20 absolute bottom-10 right-10"
          style={{ background: '#E8F4FD' }} />
        <div className="w-64 h-64 rounded-full blur-3xl opacity-15 absolute top-20 right-32"
          style={{ background: '#EBFAF3' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-6xl font-semibold text-[#1A1F36] tracking-tight leading-tight">
            DSO cut in half.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl text-[#697386] font-normal max-w-md"
        >
          AR team focused on what matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2 mt-4"
        >
          <div className="flex items-center gap-2.5">
            <MonzyLogo size={36} />
            <span className="text-2xl font-semibold text-[#1A1F36] tracking-tight">Monzy</span>
          </div>
          <a
            href="https://monzyai.com"
            className="text-sm font-medium transition-colors"
            style={{ color: '#635BFF' }}
          >
            monzyai.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
