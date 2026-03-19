import React, { useState, useEffect, useRef } from 'react';

const FREE_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'live.com', 'aol.com', 'protonmail.com',
];

function isWorkEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1];
  return domain && !FREE_DOMAINS.includes(domain.toLowerCase());
}

// Fade-in on scroll
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = '', as: Tag = 'div' }) {
  const ref = useFadeIn();
  return <Tag ref={ref} className={`fade-in ${className}`}>{children}</Tag>;
}

function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`faq-item fade-in ${open ? 'open' : ''}`}>
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <h3>{question}</h3>
        <span className="faq-toggle">×</span>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  const scrollToForm = (e) => {
    e.preventDefault();
    emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => emailRef.current?.focus(), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    setMessage({ text: '', type: '' });

    if (!trimmed || !trimmed.includes('@')) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    if (!isWorkEmail(trimmed)) {
      setMessage({ text: 'Please use your work email address.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/slack-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (res.ok) {
        setMessage({ text: "You're on the list! We'll be in touch soon.", type: 'success' });
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({ text: data.error || 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav>
        <a href="#" className="nav-logo">
          <span className="nav-logo-mark">///</span>
          <span>Monzy</span>
        </a>
        <ul className="nav-links">
          <li><a href="#agents">How it works</a></li>
          <li><a href="#faq">FAQs</a></li>
        </ul>
        <a href="#" className="nav-cta" onClick={scrollToForm}>Join Beta</a>
      </nav>

      {/* HERO */}
      <section className="hero-wrapper">
        <div className="hero-bg" />
        <div className="hero">
          <FadeIn className="hero-card">
            <div className="corner-dot-tr" />
            <div className="corner-dot-bl" />
            <h1>AI agents for modern<br /><em>finance teams</em></h1>
            <p className="hero-sub">
              AI agents that sits on top of your existing tools to automate
              bookkeeping, reconciliation, and compliance.
            </p>
            <form className="hero-form" onSubmit={handleSubmit}>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email address"
                required
                autoComplete="email"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Join Beta'}
              </button>
            </form>
            <p className={`form-message ${message.type}`}>{message.text}</p>
            <div className="hero-pills">
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><path d="M16 18l2-2-2-2" /><path d="M8 6L6 8l2 2" /><path d="M12 2v20" /></svg>
                Automated bookkeeping
              </span>
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                Smart reconciliation
              </span>
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Compliance-ready
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AGENTS */}
      <section className="agents" id="agents">
        <FadeIn as="p" className="section-label">MEET YOUR AGENTS</FadeIn>
        <FadeIn as="h2">Experts that never <em>sleep</em></FadeIn>
        <FadeIn as="p" className="agents-sub">
          Purpose-built AI agents that automates time-consuming tasks at finance
          teams at fast-growing Indian brands.
        </FadeIn>
        <div className="agents-grid">
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 10h20M2 14h20M6 6l-4 4 4 4M18 6l4 4-4 4" />
              </svg>
            </div>
            <h3>Recon Agent</h3>
            <p>Matches bank statements with invoices, payment gateways, and platform settlements. Every rupee accounted for, automatically.</p>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3>Compliance Agent</h3>
            <p>Prepares GST returns, matches ITC, tracks TDS deductions, and flags issues before they become problems.</p>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
              </svg>
            </div>
            <h3>Vendor Agent</h3>
            <p>Manages payables, schedules payments, generates TDS certificates, and keeps vendor relationships healthy.</p>
          </FadeIn>
        </div>
        <FadeIn as="p" className="agents-more">......and more agents built for your workflow.</FadeIn>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <FadeIn as="p" className="section-label">FAQ</FadeIn>
        <FadeIn as="h2">Here to help with<br />all your <em>questions</em></FadeIn>
        <FadeIn as="p" className="faq-sub">Everything you need to know<br />before getting started.</FadeIn>
        <div className="faq-list">
          <FaqItem
            question="Do I need to replace any existing software I use?"
            answer="No. Our agents work alongside your current tools — Tally, Zoho Books, Busy, or any other software you already use. Think of us as an extra team member which automates your specialised workflows."
            defaultOpen
          />
          <FaqItem
            question="Is my financial data secure?"
            answer="Yes. Your data is encrypted in transit and at rest. We don't store raw financial data longer than needed for processing, and we never share it with third parties. You stay in control."
            defaultOpen
          />
          <FaqItem
            question="How long does it take to get started?"
            answer="Most teams are up and running in a few hours. Connect your tools, configure your first agent, and start seeing results — no lengthy implementation cycles."
            defaultOpen
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              <span className="nav-logo-mark">///</span>
              <span>Monzy</span>
            </a>
            <p className="footer-tagline">AI agents for finance teams.</p>
          </div>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#agents">How it works</a>
            <a href="#faq">FAQs</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="#" aria-label="X">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
          <span className="footer-status">All systems operational</span>
        </div>
      </footer>
    </>
  );
}
