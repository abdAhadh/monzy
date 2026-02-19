import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
ArrowRight,
Check,
Database,
Zap,
Brain,
TrendingUp,
Calendar,
Users,
Mail,
Slack,
Globe,
BarChart3,
ChevronDown,
LayoutGrid,
History,
MousePointer2,
PlayCircle,
AlertCircle,
Search,
Bell,
MessageSquare,
Clock,
ShieldCheck,
Send,
Plus,
Minus,
CheckCircle2
} from 'lucide-react';

// --- UI Components ---
const SectionHeader = ({ badge, title, subtitle, left = true }) => (
<div className={`mb-8 md:mb-12 ${left ? 'text-left' : 'text-center'}`}>
{badge && (
<span className="inline-block px-2 py-1 mb-4 text-[10px] font-bold tracking-widest uppercase border border-white/20 text-orange-500 rounded-sm bg-orange-500/5">
{badge}
</span>
)}
<h2 className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight text-white mb-4 md:mb-6 leading-tight">
{title}
</h2>
{subtitle && (
<p className={`text-slate-400 max-w-4xl text-base md:text-lg leading-relaxed ${!left ? 'mx-auto' : ''}`}>
{subtitle}
</p>
)}
</div>
);

// --- Individual Card Animations (Hover & Mobile In-View Aware) ---
const AnalyticalBrainAnim = ({ active }) => {
const [step, setStep] = useState(0);
const questions = ["Should I raise rates?", "Why is pickup slow?", "What's driving demand?"];

  useEffect(() => {
if (!active) return;
const interval = setInterval(() => setStep(s => (s + 1) % questions.length), 3000);
return () => clearInterval(interval);
}, [active]);

return (
<div className="relative h-40 w-full mt-6 border border-white/5 bg-white/[0.02] rounded-sm overflow-hidden p-4 font-mono text-[10px]">
<div className="flex flex-col gap-3">
<div className="flex gap-2 text-orange-500">
<span className="shrink-0 underline">USER:</span>
<motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{questions[step]}</motion.span>
</div>
<div className="flex gap-4 items-center opacity-40">
{[Database, Globe, Mail, Calendar].map((Icon, i) => (
<motion.div
               key={i}
               animate={active ? { opacity: [0.3, 1, 0.3], scale: [1, 1.1, 1] } : {}}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
>
<Icon size={12} />
</motion.div>
))}
<div className="h-[1px] flex-1 bg-white/20" />
<Brain size={14} className={`text-blue-400 ${active ? 'animate-pulse' : ''}`} />
</div>
<div className="text-white/60 bg-white/5 p-2 rounded-sm border border-white/10">
<span className="text-blue-400">MONZY:</span> Analyzing 4 systems... Demand spike detected. BAR increase recommended.
</div>
</div>
</div>
);
};

const MemoryKeeperAnim = ({ active }) => (
<div className="mt-6 space-y-3">
<div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
<motion.div
        initial={{ width: "95%" }}
        animate={active ? { x: ["-100%", "0%"] } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] w-full"
      />
</div>
<div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
<span>Memory Indexing</span>
<span className={`text-blue-400 ${active ? 'animate-pulse' : ''}`}>95% Indexed</span>
</div>
<div className="grid grid-cols-2 gap-2 opacity-40">
{['Email_Oct15', 'Slack_Thread', 'Meeting_Notes', 'Decision_Log'].map((item, i) => (
<div key={i} className="p-1.5 md:p-2 border border-white/10 rounded-sm text-[8px] text-white flex items-center gap-2">
<History size={10} /> {item}
</div>
))}
</div>
</div>
);

const StrategistAnim = ({ active }) => (
<div className="mt-4 p-3 border border-orange-500/20 bg-orange-500/5 rounded-sm relative overflow-hidden">
<div className="flex items-center gap-2 mb-3">
<motion.div animate={active ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-orange-500" />
<span className="text-[10px] font-bold text-white uppercase tracking-widest">Recommended Rate</span>
</div>
<div className="text-2xl font-bold text-white mb-2 tracking-tighter">$229 <span className="text-xs text-emerald-400 font-medium">+18%</span></div>
<div className="space-y-1">
{['Comp set up 12%', 'Concert Saturday', 'Occupancy 82%'].map((txt, i) => (
<div key={i} className="flex items-center gap-2 text-[9px] text-slate-400">
<Check size={10} className="text-emerald-500" /> {txt}
</div>
))}
</div>
<div className="flex gap-2 mt-4">
<div className="flex-1 py-1 bg-white/10 text-center text-[8px] font-bold uppercase tracking-widest text-white border border-white/10">Adjust</div>
<div className="flex-1 py-1 bg-orange-500 text-center text-[8px] font-bold uppercase tracking-widest text-black">Accept</div>
</div>
</div>
);

const ExecutorAnim = ({ active }) => {
const [ticks, setTicks] = useState(0);

  useEffect(() => {
if (!active) { setTicks(0); return; }
const timer = setInterval(() => setTicks(t => (t + 1) % 48), 1000);
return () => clearInterval(timer);
}, [active]);

const systems = ["PMS Updated", "Channel Sync", "OTA Live", "Direct Sync"];
return (
<div className="mt-4 space-y-2">
<div className="flex justify-between items-end mb-2">
<div className="text-2xl md:text-3xl font-mono text-white tabular-nums">{ticks}s</div>
<div className={`text-[8px] text-emerald-500 font-bold uppercase tracking-widest ${active ? 'animate-pulse' : 'opacity-0'}`}>Executing...</div>
</div>
{systems.map((s, i) => (
<div key={i} className="flex items-center justify-between p-2 border border-white/5 bg-white/[0.02] rounded-sm">
<span className="text-[9px] text-slate-400">{s}</span>
<motion.div initial={{ scale: 0 }} animate={{ scale: (active && ticks > (i * 10)) ? 1 : 0 }}>
<Check size={10} className="text-emerald-500" />
</motion.div>
</div>
))}
</div>
);
};

const SentinelAnim = ({ active }) => (
<div className="mt-4 relative h-32 w-full border border-white/10 bg-black rounded-sm overflow-hidden">
<div className="absolute inset-0 flex items-center justify-center">
<div className={`w-24 h-24 border border-orange-500/20 rounded-full ${active ? 'animate-ping' : ''}`} />
<div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent" />
</div>
<div className="absolute inset-0 p-3 space-y-2">
<AnimatePresence>
{active && (
<motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-2 bg-[#0a0c10] border border-orange-500/20 rounded-sm flex items-center gap-2">
<Bell size={10} className="text-orange-500" />
<div className="text-[8px] text-white">Taylor Swift Alert (+40%)</div>
</motion.div>
)}
</AnimatePresence>
</div>
<div className="absolute bottom-0 w-full h-1 bg-orange-500/30">
<motion.div animate={active ? { x: [-100, 200] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-full bg-orange-500" />
</div>
</div>
);

const MonzyLogo = ({ size = 20 }) => (
<svg width={size} height={size} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.974 35C5.361 35 0 29.639 0 23.026V11.974C0 5.361 5.361 0 11.974 0H23.026C29.639 0 35 5.361 35 11.974V23.026C35 29.639 29.639 35 23.026 35H11.974Z" fill="white"/>
<path d="M13.7021 15.125C16.7591 13.666 19.1901 11.156 20.5521 8.05396C19.6631 7.11996 18.5061 6.45296 17.2611 6.05296L16.5941 5.82996C16.5441 5.92696 16.5131 6.03296 16.5051 6.14096C15.4371 9.16696 13.2571 11.612 10.3231 12.991C8.27605 13.97 6.76405 15.749 6.05205 17.885L5.83105 18.551C5.92705 18.601 6.03305 18.631 6.14105 18.64C6.98705 18.951 7.83105 19.352 8.63205 19.842C9.78905 17.78 11.5621 16.13 13.7021 15.125ZM26.6031 15.304C24.9401 17.826 22.6161 19.841 19.8851 21.131C17.6181 22.199 15.8821 24.2 15.0821 26.602L14.8591 27.358C15.7231 28.124 16.7391 28.699 17.8401 29.048L18.5061 29.271C18.5571 29.174 18.5871 29.068 18.5961 28.959C19.6631 25.934 21.8431 23.488 24.7781 22.11C26.8241 21.131 28.3811 19.352 29.0491 17.216L29.2711 16.55C28.3371 16.283 27.4471 15.837 26.6031 15.304ZM13.0791 25.047C14.1871 22.37 16.2471 20.199 18.8621 18.952C21.2641 17.796 23.2651 16.018 24.6441 13.838C23.6211 12.859 22.7761 11.747 22.1541 10.413C20.4881 13.459 17.9041 15.903 14.7701 17.396C12.9461 18.241 11.4781 19.709 10.5881 21.488C11.5671 22.423 12.3681 23.579 12.9901 24.868L13.0791 25.047Z" fill="#0a0c10"/>
</svg>
);

const scrollToDemo = () => {
  const section = document.getElementById('demo-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const input = document.getElementById('demo-email');
      if (input) input.focus();
    }, 800);
  }
};

// --- Sections ---
const Navbar = () => (
<nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md">
<div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
<div className="flex items-center gap-10">
<div className="flex items-center gap-2">
<MonzyLogo size={24} />
<span className="text-lg font-medium tracking-tight text-white">Monzy</span>
</div>
</div>
<div className="flex items-center gap-4">
<button onClick={scrollToDemo} className="bg-white text-black px-3 md:px-4 py-1.5 text-[10px] md:text-[12px] font-bold rounded-sm hover:bg-slate-200 transition-all uppercase tracking-tight">
Request Demo
</button>
</div>
</div>
</nav>
);

const Hero = () => {
const [alertIndex, setAlertIndex] = useState(0);
const proactiveAlerts = [
"Event: Taylor Swift Feb 21 - Demand surge +40%",
"Group 'Tech Corp' washed 80 rooms - transient window open",
"Parity Alert: Booking.com vs Direct +12% diff detected",
"Comp set ADR increased by $22 in last 2 hours",
"Velocity Alert: +15 bookings for March since 09:00"
];

  useEffect(() => {
const timer = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % proactiveAlerts.length);
}, 4500);
return () => clearInterval(timer);
}, []);

return (
<section className="pt-24 sm:pt-32 lg:pt-48 pb-16 md:pb-24 border-b border-white/5 bg-[#0a0c10]">
<div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
<div className="text-left">
<motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight text-white mb-4 md:mb-6 leading-[1.1] md:leading-[1.05]"
>
Your AI <br />
<span className="text-slate-500">Revenue Co-Pilot</span>
</motion.h1>
<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }} className="text-base md:text-xl text-slate-400 max-w-xl mb-8 md:mb-10 leading-relaxed">
Make faster, better pricing decisions without switching between 8 systems or losing context. Connect your tech stack into one agentic brain.
</motion.p>
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }} className="flex flex-wrap items-center gap-4">
<button onClick={scrollToDemo} className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-black font-bold rounded-sm hover:bg-slate-200 transition-all text-sm uppercase tracking-widest">
Request Demo <ArrowRight size={16} className="inline ml-2 sm:ml-0 group-hover:translate-x-1 transition-transform" />
</button>
</motion.div>
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-10 text-[10px] md:text-[11px] font-bold text-slate-600 uppercase tracking-widest">
<div className="flex items-center gap-2"><Check size={14} className="text-orange-500" /> Save 3+ hours daily</div>
<div className="flex items-center gap-2"><Check size={14} className="text-orange-500" /> Optimise RevPAR</div>
<div className="flex items-center gap-2"><Check size={14} className="text-orange-500" /> Drive ADR</div>
</motion.div>
</div>
<div className="relative block">
<div className="aspect-square bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-center overflow-hidden tech-grid relative max-w-[400px] mx-auto lg:max-w-none">
<svg viewBox="0 0 240 240" className="w-full h-full p-6 md:p-8">
<circle cx="120" cy="120" r="80" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="2 4" className="opacity-20" />
<circle cx="120" cy="120" r="50" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="2 4" className="opacity-10" />
<g transform="translate(105, 105)">
<rect width="30" height="30" fill="white" />
<motion.rect
                  width="30" height="30" fill="none" stroke="white" strokeWidth="0.5"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
<Zap x="7.5" y="7.5" size={15} className="text-black fill-current" />
</g>
{[
{ x: 120, y: 40, icon: <Database size={12} />, label: "PMS SYSTEM" },
{ x: 200, y: 120, icon: <TrendingUp size={12} />, label: "RMS ENGINE" },
{ x: 120, y: 200, icon: <Globe size={12} />, label: "DISTRIBUTION" },
{ x: 40, y: 120, icon: <Mail size={12} />, label: "COMMUNICATIONS" }
].map((node, i) => (
<g key={i}>
<motion.line x1={120} y1={120} x2={node.x} y2={node.y} stroke="white" strokeWidth="0.5" strokeDasharray="4 4" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.75 }} />
<motion.circle r="1.2" fill="white" animate={{ cx: [node.x, 120], cy: [node.y, 120], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.5, ease: "linear" }} />
<rect x={node.x - 12} y={node.y - 12} width="24" height="24" fill="#0a0c10" stroke="white" strokeWidth="0.5" />
<foreignObject x={node.x - 6} y={node.y - 6} width="12" height="12">
<div className="text-white flex items-center justify-center opacity-70">{node.icon}</div>
</foreignObject>
<text x={node.x} y={node.y + 22} fill="white" fontSize="4" textAnchor="middle" className="font-mono uppercase opacity-40 tracking-widest">{node.label}</text>
</g>
))}
<motion.g animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ originX: "120px", originY: "120px" }}>
<line x1="120" y1="120" x2="120" y2="40" stroke="white" strokeWidth="0.2" className="opacity-30" />
<circle cx="120" cy="40" r="1.5" fill="white" className="opacity-30" />
</motion.g>
</svg>
<div className="absolute top-4 left-4 p-1.5 md:p-2 border border-white/10 bg-black/40 backdrop-blur-sm rounded-sm">
<div className="flex items-center gap-2">
<div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 animate-pulse" />
<span className="text-[7px] md:text-[8px] font-bold text-white uppercase tracking-tighter">Proactive Intel Feed</span>
</div>
</div>
<div className="absolute bottom-4 right-4 p-2.5 md:p-3 border border-orange-500/20 bg-orange-500/5 backdrop-blur-md rounded-sm min-w-[140px] md:min-w-[180px] overflow-hidden">
<div className="flex items-center gap-2 mb-2 relative z-10">
<Bell size={10} className="text-orange-500" />
<div className="text-[6px] md:text-[7px] text-orange-500 uppercase font-bold tracking-widest">Agent Recommendation</div>
</div>
<div className="h-10 relative">
<AnimatePresence>
<motion.div key={alertIndex} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }} className="text-[8px] md:text-[9px] text-white leading-snug font-mono absolute inset-0 flex items-center">
{proactiveAlerts[alertIndex]}
</motion.div>
</AnimatePresence>
</div>
</div>
</div>
</div>
</div>
</section>
);
};

const ProblemSection = () => {
const stats = [
{ val: "2-3 hrs", label: "Wasted daily on data gathering", color: "text-red-500" },
{ val: "4-8 hrs", label: "Lag behind market moves", color: "text-red-500" },
{ val: "$50-200", label: "Lost per room per event", color: "text-red-500" },
];
return (
<section id="problem" className="py-16 md:py-24 border-b border-white/5 bg-[#0a0c10]">
<div className="max-w-7xl mx-auto px-4 md:px-6">
<SectionHeader
          badge="The Problem"
          title={<>Revenue management has become <br className="hidden sm:block" /><span className="text-slate-500">data archaeology.</span></>}
          subtitle="Every pricing decision requires excavating data from 8+ disconnected systems. By the time you have the full picture, the opportunity is gone."
        />
<div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10 mt-10 md:mt-16">
{stats.map((s, i) => (
<div key={i} className="bg-[#0a0c10] p-8 md:p-10 group transition-colors duration-500 hover:bg-[#0e1117]">
<div className={`text-4xl md:text-5xl font-bold mb-4 tracking-tighter ${s.color}`}>{s.val}</div>
<p className="text-slate-400 text-sm leading-relaxed">{s.label}</p>
</div>
))}
</div>
</div>
</section>
);
};

const BentoGrid = () => {
const [hoveredIndex, setHoveredIndex] = useState(null);
const tools = ['PMS', 'RMS', 'OTAs', 'CRM', 'CHANNEL MGR', 'EMAIL', 'SLACK', 'ANALYTICS'];

// Mobile viewport tracking to auto-play animations
const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
}, []);

const cardStyle = (index) => `
    relative bg-[#0a0c10] p-6 md:p-10 flex flex-col justify-between transition-all duration-300 border
${hoveredIndex === index ? 'bg-[#0e1117] border-white/20 z-10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]' : 'border-transparent'}
  `;

return (
<section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6" id="product">
<SectionHeader
        badge="Product"
        title="Take revenue decisions in minutes, not hours"
        subtitle={<>Picture ChatGPT, but connected to your entire tech stack. <br className="hidden md:block" />Crunches data like your best analyst, remembers every decision you've made, and executes rate changes across all your systems.</>}
      />
<div className="grid grid-cols-1 md:grid-cols-6 gap-[1px] bg-white/10 border border-white/10">
{/* Card 1 */}
<motion.div
          className={`md:col-span-3 ${cardStyle(0)}`}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileInView={isMobile ? { opacity: 1 } : {}}
          onViewportEnter={() => isMobile && setHoveredIndex(0)}
>
<div><MessageSquare size={24} className="text-orange-500 mb-6" /><h3 className="text-xl md:text-2xl text-white font-medium mb-4 tracking-tight">Ask Anything. Get Answers.</h3><p className="text-slate-400 text-sm leading-relaxed max-w-md">Ask any question. Monzy analyzes across PMS, comp set, emails, events - and gives you actionable answers.</p></div>
<AnalyticalBrainAnim active={hoveredIndex === 0} />
<div className="flex flex-wrap gap-1 mt-6">{tools.map(t => (<span key={t} className="text-[7px] font-bold text-slate-600 border border-white/5 px-1.5 py-0.5 rounded-sm">{t}</span>))}</div>
</motion.div>
{/* Card 2 */}
<motion.div
          className={`md:col-span-3 ${cardStyle(1)}`}
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          onViewportEnter={() => isMobile && setHoveredIndex(1)}
>
<div><History size={24} className="text-blue-400 mb-6" /><h3 className="text-xl md:text-2xl text-white font-medium mb-4 tracking-tight">Never Lose Context</h3><p className="text-slate-400 text-sm leading-relaxed max-w-md">"What did we decide?" "What rate did I quote?" "What did Sales agree to?" Monzy remembers every decision, conversation, and commitment - so you don't have to.</p></div>
<MemoryKeeperAnim active={hoveredIndex === 1} />
</motion.div>
{/* Card 3 */}
<motion.div
          className={`md:col-span-2 ${cardStyle(2)}`}
          onMouseEnter={() => setHoveredIndex(2)}
          onMouseLeave={() => setHoveredIndex(null)}
          onViewportEnter={() => isMobile && setHoveredIndex(2)}
>
<MousePointer2 size={24} className="text-orange-500 mb-6" /><h4 className="text-lg text-white font-medium mb-2 tracking-tight">Get Pricing Recommendations</h4><p className="text-slate-400 text-xs leading-relaxed">Monzy suggests rates with full reasoning. Accept or adjust.</p>
<StrategistAnim active={hoveredIndex === 2} />
</motion.div>
{/* Card 4 */}
<motion.div
          className={`md:col-span-2 ${cardStyle(3)}`}
          onMouseEnter={() => setHoveredIndex(3)}
          onMouseLeave={() => setHoveredIndex(null)}
          onViewportEnter={() => isMobile && setHoveredIndex(3)}
>
<Zap size={24} className="text-yellow-400 mb-6" /><h4 className="text-lg text-white font-medium mb-2 tracking-tight">Execute Rate Changes Instantly</h4><p className="text-slate-400 text-xs leading-relaxed">Say "raise rates to $229." Monzy updates PMS, channel manager, and all OTAs. 47 seconds. Done.</p>
<ExecutorAnim active={hoveredIndex === 3} />
</motion.div>
{/* Card 5 */}
<motion.div
          className={`md:col-span-2 ${cardStyle(4)}`}
          onMouseEnter={() => setHoveredIndex(4)}
          onMouseLeave={() => setHoveredIndex(null)}
          onViewportEnter={() => isMobile && setHoveredIndex(4)}
>
<ShieldCheck size={24} className="text-emerald-500 mb-6" /><h4 className="text-lg text-white font-medium mb-2 tracking-tight">Catch Revenue Opportunities First</h4><p className="text-slate-400 text-xs leading-relaxed">Concert announced? Comp set moved? Group cancelled? Real-time alerts with recommended actions.</p>
<SentinelAnim active={hoveredIndex === 4} />
</motion.div>
</div>
</section>
);
};

const FinalCTA = () => {
const [email, setEmail] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
const [error, setError] = useState('');

const isWorkEmail = (e) => {
const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com', 'aol.com', 'protonmail.com'];
const domain = e.split('@')[1];
return domain && !freeDomains.includes(domain.toLowerCase());
};

const handleSubmit = (e) => {
    e.preventDefault();
if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
return;
}
if (!isWorkEmail(email)) {
      setError('Please provide a work email address.');
return;
}
    setError('');
    setIsSubmitted(true);
};

return (
<section id="demo-section" className="py-24 md:py-32 bg-[#0a0c10] border-t border-white/5">
<div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
<h2 className="text-3xl md:text-6xl font-medium tracking-tight text-white mb-6 md:mb-8">
Stop switching. Start deciding.
</h2>
<p className="text-base md:text-xl text-slate-400 mb-10 md:mb-12 max-w-2xl mx-auto">
Revenue managers using Monzy make decisions in minutes, not hours. Reclaim your time and maximise RevPAR.
</p>
<AnimatePresence mode="wait">
{!isSubmitted ? (
<motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto relative px-2"
>
<div className="flex flex-col sm:flex-row gap-3">
<input
id="demo-email"
type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
<button
type="submit"
                    className="px-6 md:px-8 py-4 bg-white text-black font-bold rounded-sm hover:bg-slate-200 transition-all text-sm uppercase tracking-widest shrink-0"
>
Request Demo
</button>
</div>
{error && (
<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] mt-2 font-bold uppercase tracking-widest md:absolute md:-bottom-6 left-0 right-0">
{error}
</motion.p>
)}
</motion.form>
) : (
<motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex flex-col items-center gap-4 p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-sm mx-auto">
<div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2">
<CheckCircle2 size={32} />
</div>
<h3 className="text-white text-xl font-medium tracking-tight">Request Received</h3>
<p className="text-slate-400 text-sm">Our team will reach out to you within 24 hours.</p>
</motion.div>
)}
</AnimatePresence>
<div className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest">
<span>Early access</span><div className="hidden sm:block w-1 h-1 rounded-full bg-slate-800" /><span>Limited spots</span><div className="hidden sm:block w-1 h-1 rounded-full bg-slate-800" /><span>Secure infrastructure</span>
</div>
</motion.div>
</div>
</section>
);
};

const FAQItem = ({ q, a }) => {
const [open, setOpen] = useState(false);
return (
<div className="border-b border-white/10 bg-[#0a0c10]">
<button
        onClick={() => setOpen(!open)}
        className="w-full py-8 md:py-10 flex items-start gap-4 text-left group transition-all"
>
<span className="mt-1.5 shrink-0 flex items-center justify-center text-cyan-400 font-light">
{open ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
</span>
<span className="text-lg md:text-2xl font-normal text-white group-hover:text-slate-300 transition-colors tracking-tight">{q}</span>
</button>
<AnimatePresence>
{open && (
<motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
>
<div className="pl-9 md:pl-10 pb-10 text-slate-400 text-base md:text-lg leading-relaxed max-w-4xl whitespace-pre-wrap">
{a}
</div>
</motion.div>
)}
</AnimatePresence>
</div>
);
};

const FAQSection = () => {
const faqs = [
{
      q: "Does this work with my systems?",
      a: "Yes. Monzy integrates with the RMS, PMS, CM, CRM and any other tool you already use. It understands the entities across systems and adapts to unique data model of your setup. \n\nIf we don't already support integration with any of your system, we can build it within 1 week once we get API access."
},
{
      q: "How much time does it save?",
      a: "2-3 hours daily. Revenue managers reclaim 10-15 hours per week for strategic work instead of data gathering."
},
{
      q: "Does it replace my RMS?",
      a: "No. Think of Monzy as a intelligent AI agent sitting on top of your existing systems to make your life easier."
},
{
      q: "How long is setup?",
      a: "3-5 days typically. Ideally, you're live and seeing value within a week."
},
{
      q: "Is my data secure?",
      a: "Yes. SOC 2 compliant, end-to-end encryption. Your data stays encrypted and under your control."
}
];
return (
<section className="py-24 md:py-32 bg-[#0a0c10] border-t border-white/5">
<div className="max-w-5xl mx-auto px-4 md:px-6">
<SectionHeader
          badge="FAQ"
          title="Questions RMs ask us"
          subtitle="Here's what you need to know."
        />
<div className="mt-8 md:mt-12">
{faqs.map((f, i) => (
<FAQItem key={i} q={f.q} a={f.a} />
))}
</div>
</div>
</section>
);
};

const Footer = () => (
<footer className="py-20 md:py-32 border-t border-white/5 bg-[#0a0c10]">
<div className="max-w-7xl mx-auto px-4 md:px-6">
<div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
<div className="space-y-6 md:space-y-10">
<div className="flex items-center gap-3">
<MonzyLogo size={28} />
<span className="text-xl font-medium tracking-tight text-white">Monzy</span>
</div>
<div className="space-y-8 md:space-y-12">
<p className="text-slate-500 text-sm max-w-sm leading-relaxed">
World's first revenue co-pilot for hospitality.
</p>
<div className="text-[10px] md:text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em]">
&copy; 2026 TIDALPEAK LABS PRIVATE LTD.
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row gap-6 md:gap-12 text-sm font-medium text-slate-500">
<a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
<a href="#" className="hover:text-white transition-colors">Terms of Service</a>
</div>
</div>
</div>
</footer>
);

export default function App() {
return (
<div className="bg-[#0a0c10] text-slate-200 selection:bg-orange-500 selection:text-white min-h-screen">
<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0a0c10; overflow-x: hidden; }
        h1, h2, h3, h4 { letter-spacing: -0.04em; }
        .tech-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0c10; }
        ::-webkit-scrollbar-thumb { background: #222; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
<Navbar />
<main className="tech-grid overflow-hidden">
<Hero />
<ProblemSection />
<BentoGrid />
<FinalCTA />
<FAQSection />
</main>
<Footer />
</div>
);
}
