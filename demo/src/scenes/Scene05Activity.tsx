import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import Waveform from '../components/Waveform';

export type ActivityVariant = 'whatsapp' | 'call' | 'email' | 'dispute';

interface Props { isActive: boolean; variant?: ActivityVariant; }

// ── Timeline (ms from scene start) — calibrated to VO audio ─────────────────
const T = {
  CARD1:              800,
  WA_DELIVERED:      2200,
  WA_REPLY:          4000,
  WA_AR:             5400,
  WA_BADGE:          6200,

  CARD2:             7500,   // VO: "When a customer prefers a call..."
  CALL_L1:           7900,
  CALL_L2:           8400,
  CALL_L3:           8900,
  CALL_DONE:         9500,
  CALL_AR:           9900,
  CALL_BADGE:       10300,

  CARD3:            11000,   // VO: "An email reply comes in..."
  EMAIL_REPLY:      11800,
  EMAIL_EXTRACT:    12800,
  EMAIL_AR:         13600,
  EMAIL_BADGE:      14200,

  CARD4:            16900,   // VO: "We know you run into disputes..."
  DISPUTE_MSG:      18400,
  DISPUTE_DETECTED: 21000,
  DISPUTE_AR:       23500,
  DISPUTE_BADGE:    26000,

  TAGLINE:          29900,   // VO: "Every customer handled..."
};

// ── AR update sheet — slides up from bottom of right panel ───────────────────
function ARUpdateSheet({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-20 rounded-b-xl overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 pt-3.5 pb-4" style={{ background: '#A87C28' }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#A87C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <span className="text-sm font-bold text-white">AR Record Updated</span>
        </div>
        {/* Fields */}
        <div className="flex flex-col gap-1.5">
          {fields.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.25 }}
              className="flex items-center justify-between"
            >
              <span className="text-xs text-[#F5E8C8]">{label}</span>
              <span className="text-xs font-semibold text-white">{value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── WhatsApp panel ────────────────────────────────────────────────────────────
function WhatsAppPanel({ delivered, reply, arUpdated }: { delivered: boolean; reply: boolean; arUpdated: boolean }) {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white relative">
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-emerald-600 text-white flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-xs font-bold">S</div>
        <div>
          <div className="text-xs font-semibold">Suresh, Ratan Distributors</div>
          <div className="text-[10px] text-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />online
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 p-3 bg-[#ECE5DD] gap-2 overflow-auto">
        {/* Monzy's outgoing message */}
        <motion.div className="self-end max-w-[85%]"
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 shadow-sm">
            <p className="text-[11px] text-gray-800 leading-relaxed">
              Hi Suresh, a quick reminder on Invoice #2341 for <strong>₹3,87,000</strong> due 32 days ago. Please let us know your payment timeline.
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] text-gray-400">10:02 AM</span>
              {delivered ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-[#A87C28]">✓✓</motion.span>
              ) : (
                <span className="text-[10px] text-gray-400">✓</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Customer reply */}
        {reply && (
          <motion.div className="self-start max-w-[85%]"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm">
              <p className="text-[11px] text-gray-800 leading-relaxed">
                Hi, will process <strong>₹2,00,000</strong> by Thursday. Remaining balance by end of month. Sorry for the delay.
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] text-gray-400">10:05 AM</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* AR update sheet */}
      {arUpdated && (
        <ARUpdateSheet fields={[
          { label: 'Customer',    value: 'Ratan Distributors' },
          { label: 'Commitment',  value: '₹2,00,000' },
          { label: 'Expected by', value: 'Thursday' },
          { label: 'Status',      value: 'Commitment received ✓' },
        ]} />
      )}
    </div>
  );
}

// ── Call panel ────────────────────────────────────────────────────────────────
function CallPanel({ line1, line2, line3, done, arUpdated }: {
  line1: boolean; line2: boolean; line3: boolean; done: boolean; arUpdated: boolean;
}) {
  const [secs, setSecs] = useState(1);
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [done]);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white relative">
      {/* Call header */}
      <div className="flex flex-col items-center justify-center gap-2 px-4 pt-5 pb-4 border-b border-gray-50 flex-shrink-0">
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#FDF6E8' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#A87C28"/>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-[#111111]">Kapoor Enterprises</div>
          <div className="text-[10px] text-[#999999] mt-0.5">{done ? 'Call completed' : 'Outgoing call'}</div>
        </div>
        <div className="font-mono text-xl font-semibold" style={{ color: '#A87C28' }}>{m}:{s}</div>
        {!done && <Waveform bars={7} color="#A87C28" height={22} />}
        <div className="text-[10px] text-[#999999]">AI voice agent · Monzy</div>
      </div>

      {/* Subtitle-style transcript — one line at a time */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0" style={{ background: '#FAF9F6' }}>
        {(() => {
          // Derive the single active subtitle from flags
          const active = line3
            ? { speaker: 'Monzy', color: '#A87C28', bg: '#FDF6E8', text: 'Understood. Logging payment promise of ₹1,20,000 within 7 days. Thank you.' }
            : line2
            ? { speaker: 'Kapoor', color: '#555555', bg: '#F0EDE6', text: 'Yes, we are aware. Will process the full payment by next week, maximum.' }
            : line1
            ? { speaker: 'Monzy', color: '#A87C28', bg: '#FDF6E8', text: 'Hi, calling about Invoice #1234 for ₹1,20,000 overdue by 28 days. When can we expect payment?' }
            : null;

          const key = line3 ? 'l3' : line2 ? 'l2' : line1 ? 'l1' : 'none';

          return (
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col items-center gap-2 text-center"
                >
                  {/* Speaker chip */}
                  <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: active.bg, color: active.color }}>
                    {active.speaker}
                  </div>
                  {/* Subtitle text */}
                  <p style={{ fontSize: 15, color: '#111827', lineHeight: 1.55, fontWeight: 500, maxWidth: 280 }}>
                    {active.text}
                  </p>
                </motion.div>
              ) : (
                <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs italic" style={{ color: '#E8E4DC' }}>
                  Connecting…
                </motion.p>
              )}
            </AnimatePresence>
          );
        })()}
      </div>

      {/* AR update sheet */}
      {arUpdated && (
        <ARUpdateSheet fields={[
          { label: 'Customer',   value: 'Kapoor Enterprises' },
          { label: 'Promise',    value: '₹1,20,000' },
          { label: 'Timeline',   value: 'Within 7 days' },
          { label: 'Source',     value: 'Voice call transcript ✓' },
        ]} />
      )}
    </div>
  );
}

// ── Gmail M-envelope logo ────────────────────────────────────────────────────
function GmailLogo() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Envelope body */}
      <rect width="28" height="22" rx="2" fill="white" stroke="#E0E0E0" strokeWidth="0.5"/>
      {/* Left red flap */}
      <path d="M0 2L14 12L0 22V2Z" fill="#EA4335"/>
      {/* Right blue flap */}
      <path d="M28 2L14 12L28 22V2Z" fill="#4285F4"/>
      {/* Bottom left green */}
      <path d="M0 22L8 14L14 18.5L20 14L28 22H0Z" fill="#34A853"/>
      {/* Top M fold */}
      <path d="M0 2H28L14 12L0 2Z" fill="#EA4335"/>
      {/* Inner white M highlight */}
      <path d="M4 2H24L14 9.5L4 2Z" fill="#FBBC04" opacity="0.0"/>
    </svg>
  );
}

// ── Email panel — Gmail thread view ──────────────────────────────────────────
function EmailPanel({ replyVisible, extracted, arUpdated }: {
  replyVisible: boolean; extracted: boolean; arUpdated: boolean;
}) {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border shadow-sm relative"
      style={{ background: '#F6F8FC', borderColor: '#E0E0E0' }}>

      {/* ── Gmail top bar ── */}
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
        <GmailLogo />
        <span style={{ fontSize: 18, color: '#5F6368', fontFamily: 'Google Sans, Roboto, sans-serif', fontWeight: 400 }}>
          Gmail
        </span>
        {/* Action icons */}
        <div className="ml-auto flex items-center gap-1">
          {['M','↩','⋯'].map((icon, i) => (
            <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
              style={{ color: '#444746', fontSize: 12 }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* ── Thread subject ── */}
      <div className="px-4 py-3 flex-shrink-0"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
        <div style={{ fontSize: 20, fontWeight: 400, color: '#202124', lineHeight: 1.3 }}>
          Payment reminder: Invoice #2901
        </div>
        <div style={{ fontSize: 11, color: '#5F6368', marginTop: 2 }}>Inbox · 2 messages</div>
      </div>

      {/* ── Thread messages ── */}
      <div className="flex-1 overflow-auto px-3 py-2 flex flex-col gap-1.5 min-h-0"
        style={{ background: '#F6F8FC' }}>

        {/* Message 1 — Monzy's outgoing (sent) */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          {/* Sender row */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: '#4285F4' }}>M</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>Monzy AR</span>
                <span style={{ fontSize: 11, color: '#5F6368' }}>&lt;ar@monzyai.com&gt;</span>
              </div>
              <span style={{ fontSize: 11, color: '#5F6368' }}>to accounts@mehtafoods.com</span>
            </div>
            <span style={{ fontSize: 11, color: '#5F6368', flexShrink: 0 }}>10:06 AM</span>
          </div>
          {/* Body */}
          <div className="px-3 pb-3" style={{ paddingLeft: 60 }}>
            <p style={{ fontSize: 13, color: '#202124', lineHeight: 1.6 }}>
              Hi team,<br /><br />
              This is a courtesy reminder for Invoice #2901 amounting to <strong>₹88,000</strong>, which was due 15 days ago.<br /><br />
              Kindly arrange the payment at the earliest. Reply to this email if you have any questions.
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34A853' }} />
              <span style={{ fontSize: 10, color: '#34A853', fontWeight: 500 }}>Delivered · 10:06 AM</span>
            </div>
            {/* Reply/Forward bar */}
            <div className="flex items-center gap-3 mt-3">
              {['↩ Reply', '↪ Forward'].map(lbl => (
                <button key={lbl}
                  className="text-[11px] px-3 py-1 rounded-full border"
                  style={{ color: '#444746', borderColor: '#DADCE0', background: 'white', cursor: 'default' }}
                >{lbl}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Message 2 — Mehta's reply */}
        {replyVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#34A853' }}>M</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>Mehta Foods</span>
                  <span style={{ fontSize: 11, color: '#5F6368' }}>&lt;accounts@mehtafoods.com&gt;</span>
                </div>
                <span style={{ fontSize: 11, color: '#5F6368' }}>to me</span>
              </div>
              <span style={{ fontSize: 11, color: '#5F6368', flexShrink: 0 }}>10:14 AM</span>
            </div>
            <div className="px-3 pb-3" style={{ paddingLeft: 60 }}>
              <p style={{ fontSize: 13, color: '#202124', lineHeight: 1.6 }}>
                Thank you for the reminder. We will process the full payment of <strong>₹88,000</strong> by next Friday, 11th April. Apologies for the delay.
              </p>
              {/* AI extraction tag */}
              {extracted && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-2 mt-2 px-2 py-1 rounded-md"
                  style={{ background: '#EDE7F6', display: 'inline-flex' }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI extracted</span>
                  <span style={{ fontSize: 10, color: '#6D28D9' }}>· April 11 · ₹88,000</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* AR update sheet */}
      {arUpdated && (
        <ARUpdateSheet fields={[
          { label: 'Customer',      value: 'Mehta Foods' },
          { label: 'Payment date',  value: 'April 11' },
          { label: 'Amount',        value: '₹88,000' },
          { label: 'Source',        value: 'Email reply extracted ✓' },
        ]} />
      )}
    </div>
  );
}

// ── Priya avatar ─────────────────────────────────────────────────────────────
function PriyaAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <img
        src="/ananya.jpg"
        alt="Priya"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 8%' }}
      />
    </div>
  );
}

// ── Dispute panel ────────────────────────────────────────────────────────────
function DisputePanel({ msgVisible, detected, arUpdated }: {
  msgVisible: boolean; detected: boolean; arUpdated: boolean;
}) {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* WhatsApp header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-emerald-600 text-white flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-xs font-bold">G</div>
        <div>
          <div className="text-xs font-semibold">Rajiv, Global Exports Ltd.</div>
          <div className="text-[10px] text-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />online
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 overflow-auto p-3 bg-[#ECE5DD] flex flex-col gap-2">
        <motion.div className="self-end max-w-[85%]"
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 shadow-sm">
            <p className="text-[11px] text-gray-800 leading-relaxed">
              Hi Rajiv, following up on Invoice #3104 for <strong>₹2,45,000</strong> due 20 days ago. Please let us know the payment status.
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] text-gray-400">10:09 AM</span>
              <span className="text-[10px] text-[#A87C28]">✓✓</span>
            </div>
          </div>
        </motion.div>

        {msgVisible && (
          <motion.div className="self-start max-w-[85%]"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm">
              <p className="text-[11px] text-gray-800 leading-relaxed">
                We received only <strong>180 units</strong>, but the invoice says 200. Can't process payment until this is resolved.
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] text-gray-400">10:12 AM</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dispute detection — red, prominent */}
      {detected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 border-t-2 border-red-500 bg-red-50"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 14H1L8 1Z" fill="white" stroke="white" strokeWidth="0.5"/>
              <path d="M8 6v3.5M8 11v.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xs font-bold text-white tracking-wide">DISPUTE DETECTED</span>
            <span className="ml-auto text-[10px] font-semibold text-red-100 bg-red-600 px-2 py-0.5 rounded-full">Quantity Mismatch</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg px-3 py-2 border border-red-200">
                <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Invoice says</div>
                <div className="text-sm font-bold text-red-800">200 units</div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-red-200">
                <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Customer received</div>
                <div className="text-sm font-bold text-red-800">180 units</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AR update — routed to Priya */}
      {arUpdated && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 border-t px-4 py-3" style={{ borderTopColor: '#C49A3A', background: '#A87C28' }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#8B6520" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-white">AR Record Updated</span>
          </div>

          {/* Routed-to row with avatar */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2" style={{ background: '#8B6520' }}>
            <PriyaAvatar size={32} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#E8D5A0] font-medium">Raised with</span>
              <span className="text-xs font-bold text-white">Priya · Warehouse Team</span>
            </div>
            <div className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { label: 'Customer', value: 'Global Exports Ltd.' },
              { label: 'Dispute',  value: 'Qty mismatch (200→180)' },
            ].map(({ label, value }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.22 }}
                className="flex flex-col"
              >
                <span className="text-[9px] text-[#E8D5A0]">{label}</span>
                <span className="text-[10px] font-semibold text-white leading-tight">{value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Activity card ─────────────────────────────────────────────────────────────
function ActivityCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-[#E8E4DC] rounded-lg p-3.5"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}
    >
      {children}
    </motion.div>
  );
}

// ── AR badge (on left card after update) ─────────────────────────────────────
function ARBadge() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1 mt-1.5 border rounded px-2 py-0.5" style={{ background: '#FDF6E8', borderColor: '#F5E8C8' }}>
      <span className="text-[9px] font-semibold" style={{ color: '#A87C28' }}>✓ AR updated</span>
    </motion.div>
  );
}

// ── Main scene ────────────────────────────────────────────────────────────────
export default function Scene05Activity({ isActive }: Props) {
  const [numCards,     setNumCards]     = useState(0);
  const [rightPanel,   setRightPanel]   = useState<'whatsapp' | 'call' | 'email' | 'dispute'>('whatsapp');

  // WhatsApp
  const [waDelivered, setWaDelivered]   = useState(false);
  const [waReply,     setWaReply]       = useState(false);
  const [waAR,        setWaAR]          = useState(false);
  const [waBadge,     setWaBadge]       = useState(false);

  // Call
  const [callL1,      setCallL1]        = useState(false);
  const [callL2,      setCallL2]        = useState(false);
  const [callL3,      setCallL3]        = useState(false);
  const [callDone,    setCallDone]      = useState(false);
  const [callAR,      setCallAR]        = useState(false);
  const [callBadge,   setCallBadge]     = useState(false);

  // Email
  const [emailReply,  setEmailReply]    = useState(false);
  const [emailExtract,setEmailExtract]  = useState(false);
  const [emailAR,     setEmailAR]       = useState(false);
  const [emailBadge,  setEmailBadge]    = useState(false);

  // Dispute
  const [disputeMsg,      setDisputeMsg]      = useState(false);
  const [disputeDetected, setDisputeDetected] = useState(false);
  const [disputeAR,       setDisputeAR]       = useState(false);
  const [disputeBadge,    setDisputeBadge]    = useState(false);

  const [tagline,     setTagline]       = useState(false);

  useEffect(() => {
    if (!isActive) {
      setNumCards(0); setRightPanel('whatsapp');
      setWaDelivered(false); setWaReply(false); setWaAR(false); setWaBadge(false);
      setCallL1(false); setCallL2(false); setCallL3(false); setCallDone(false); setCallAR(false); setCallBadge(false);
      setEmailReply(false); setEmailExtract(false); setEmailAR(false); setEmailBadge(false);
      setDisputeMsg(false); setDisputeDetected(false); setDisputeAR(false); setDisputeBadge(false);
      setTagline(false);
      return;
    }

    const ts = [
      setTimeout(() => setNumCards(1),                                 T.CARD1),
      setTimeout(() => setWaDelivered(true),                           T.WA_DELIVERED),
      setTimeout(() => setWaReply(true),                               T.WA_REPLY),
      setTimeout(() => setWaAR(true),                                  T.WA_AR),
      setTimeout(() => setWaBadge(true),                               T.WA_BADGE),

      setTimeout(() => { setNumCards(2); setRightPanel('call'); },     T.CARD2),
      setTimeout(() => setCallL1(true),                                T.CALL_L1),
      setTimeout(() => setCallL2(true),                                T.CALL_L2),
      setTimeout(() => setCallL3(true),                                T.CALL_L3),
      setTimeout(() => setCallDone(true),                              T.CALL_DONE),
      setTimeout(() => setCallAR(true),                                T.CALL_AR),
      setTimeout(() => setCallBadge(true),                             T.CALL_BADGE),

      setTimeout(() => { setNumCards(3); setRightPanel('email'); },    T.CARD3),
      setTimeout(() => setEmailReply(true),                            T.EMAIL_REPLY),
      setTimeout(() => setEmailExtract(true),                          T.EMAIL_EXTRACT),
      setTimeout(() => setEmailAR(true),                               T.EMAIL_AR),
      setTimeout(() => setEmailBadge(true),                            T.EMAIL_BADGE),

      setTimeout(() => { setNumCards(4); setRightPanel('dispute'); },  T.CARD4),
      setTimeout(() => setDisputeMsg(true),                            T.DISPUTE_MSG),
      setTimeout(() => setDisputeDetected(true),                       T.DISPUTE_DETECTED),
      setTimeout(() => setDisputeAR(true),                             T.DISPUTE_AR),
      setTimeout(() => setDisputeBadge(true),                          T.DISPUTE_BADGE),

      setTimeout(() => setTagline(true),                               T.TAGLINE),
    ];
    return () => ts.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── Left: activity feed ── */}
        <div className="flex-[6] flex flex-col gap-2 p-4 border-r border-[#E8E4DC] overflow-auto">

          {numCards >= 1 && (
            <ActivityCard>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#111111]">Ratan Distributors</span>
                <span className="font-mono text-[10px] text-[#999999]">10:02 AM</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-semibold" style={{ color: '#A87C28' }}>₹3,87,000</span>
                <span className="text-[10px] font-medium" style={{ color: '#E5424D' }}>32 days overdue</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge label="WhatsApp" variant="whatsapp" />
                <span className="text-xs text-[#777777]">WhatsApp message sent</span>
              </div>
              <p className="text-[10px] text-[#999999] italic">Prefers WhatsApp · confirmed Aug 2024</p>
              {waBadge && <ARBadge />}
            </ActivityCard>
          )}

          {numCards >= 2 && (
            <ActivityCard>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#111111]">Kapoor Enterprises</span>
                <span className="font-mono text-[10px] text-[#999999]">10:04 AM</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-semibold" style={{ color: '#A87C28' }}>₹1,20,000</span>
                <span className="text-[10px] font-medium" style={{ color: '#E5424D' }}>28 days overdue</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge label="Call" variant="call" />
                <span className="text-xs text-[#777777]">Voice call initiated</span>
              </div>
              <p className="text-[10px] text-[#999999] italic">Prefers call reminders</p>
              {callDone && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  className="text-[10px] font-medium mt-1" style={{ color: '#1EA672' }}>
                  • Call completed · response logged
                </motion.p>
              )}
              {callBadge && <ARBadge />}
            </ActivityCard>
          )}

          {numCards >= 3 && (
            <ActivityCard>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#111111]">Mehta Foods</span>
                <span className="font-mono text-[10px] text-[#999999]">10:06 AM</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-semibold" style={{ color: '#A87C28' }}>₹88,000</span>
                <span className="text-[10px] font-medium" style={{ color: '#E68C2F' }}>15 days overdue</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge label="Email" variant="email" />
                <span className="text-xs text-[#777777]">Email sent</span>
              </div>
              <p className="text-[10px] text-[#999999] italic">Default channel</p>
              {emailBadge && <ARBadge />}
            </ActivityCard>
          )}

          {numCards >= 4 && (
            <ActivityCard>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#111111]">Global Exports Ltd.</span>
                <span className="font-mono text-[10px] text-[#999999]">10:12 AM</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-semibold" style={{ color: '#A87C28' }}>₹2,45,000</span>
                <span className="text-[10px] font-medium" style={{ color: '#E68C2F' }}>20 days overdue</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge label="Dispute" variant="orange" />
                <span className="text-xs text-[#777777]">Quantity mismatch raised</span>
              </div>
              <p className="text-[10px] text-[#999999] italic">AI-detected · auto-routed to warehouse</p>
              {disputeBadge && <ARBadge />}
            </ActivityCard>
          )}

          {tagline && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xs text-[#999999] italic mt-1 text-center">
              Four customers. Every channel. Every dispute. Zero manual effort.
            </motion.p>
          )}
        </div>

        {/* ── Right: communication preview ── */}
        <div className="flex-[4] p-4 flex flex-col overflow-hidden bg-[#FAF9F6] min-h-0">
          <AnimatePresence mode="wait">
            {rightPanel === 'whatsapp' && numCards >= 1 && (
              <motion.div key="wa" className="flex-1 min-h-0 flex flex-col"
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <WhatsAppPanel delivered={waDelivered} reply={waReply} arUpdated={waAR} />
              </motion.div>
            )}
            {rightPanel === 'call' && (
              <motion.div key="call" className="flex-1 min-h-0 flex flex-col"
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <CallPanel line1={callL1} line2={callL2} line3={callL3} done={callDone} arUpdated={callAR} />
              </motion.div>
            )}
            {rightPanel === 'email' && (
              <motion.div key="email" className="flex-1 min-h-0 flex flex-col"
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <EmailPanel replyVisible={emailReply} extracted={emailExtract} arUpdated={emailAR} />
              </motion.div>
            )}
            {rightPanel === 'dispute' && (
              <motion.div key="dispute" className="flex-1 min-h-0 flex flex-col"
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <DisputePanel msgVisible={disputeMsg} detected={disputeDetected} arUpdated={disputeAR} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
