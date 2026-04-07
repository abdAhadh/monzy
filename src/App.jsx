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

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useFadeIn();
  return <Tag ref={ref} className={`fade-in ${visible ? 'visible' : ''} ${className}`}>{children}</Tag>;
}

function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} className={`faq-item fade-in ${visible ? 'visible' : ''} ${open ? 'open' : ''}`}>
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
  const [demoFs, setDemoFs] = useState(false);
  const [demoTime, setDemoTime] = useState({ current: 0, total: 0 });

  // Dynamically scale the iframe to fill the wrapper at every viewport size
  useEffect(() => {
    const IFRAME_W = 1280;
    const IFRAME_H = 768;
    const wrap = document.querySelector('.demo-embed-wrap');
    const iframe = wrap?.querySelector('iframe');

    if (demoFs) {
      if (wrap) wrap.style.height = '';

      // ── Lock body scroll so the page cannot be scrolled behind the overlay ──
      const savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // iOS Safari needs preventDefault on touchmove to stop rubber-band scroll
      const blockTouch = (e) => e.preventDefault();
      document.addEventListener('touchmove', blockTouch, { passive: false });

      // ── Apply contain-scaling ──────────────────────────────────────────────
      const controls = wrap?.querySelector('.demo-overlay-controls');

      const applyFs = () => {
        if (!iframe) return;
        // Use window.inner* — on iOS these reflect the actual VISUAL viewport,
        // whereas CSS 100vh can be the larger layout viewport (behind browser chrome)
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / IFRAME_W, vh / IFRAME_H);
        const offsetX = Math.max(0, (vw - IFRAME_W * scale) / 2);
        const offsetY = Math.max(0, (vh - IFRAME_H * scale) / 2);

        if (scale >= 1) {
          iframe.style.width     = '';
          iframe.style.height    = '';
          iframe.style.transform = '';
        } else {
          iframe.style.width     = `${IFRAME_W}px`;
          iframe.style.height    = `${IFRAME_H}px`;
          iframe.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }

        // Controls use position:fixed (set in CSS) so they're always relative
        // to the visual viewport — immune to 100vh vs innerHeight discrepancy.
        // Pin them to the bottom-right corner of the VIDEO content area.
        if (controls) {
          const videoBottomFromViewportBottom = vh - (offsetY + IFRAME_H * scale);
          controls.style.bottom = `${videoBottomFromViewportBottom + 20}px`;
          controls.style.right  = `${offsetX + 20}px`;
        }
      };

      applyFs();
      window.addEventListener('resize', applyFs);

      return () => {
        window.removeEventListener('resize', applyFs);
        document.removeEventListener('touchmove', blockTouch);
        document.body.style.overflow = savedOverflow;
        document.documentElement.style.overflow = '';
        // Reset all inline overrides — CSS defaults take over
        if (controls) {
          controls.style.bottom   = '';
          controls.style.right    = '';
          controls.style.position = '';
        }
      };
    }

    const apply = () => {
      const w = wrap?.offsetWidth;
      if (!wrap || !w) return;
      const scale = w / IFRAME_W;
      wrap.style.height = `${Math.round(IFRAME_H * scale)}px`;
      const iframeEl = wrap.querySelector('iframe');
      if (iframeEl) iframeEl.style.transform = `scale(${scale})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    if (wrap) ro.observe(wrap);
    return () => ro.disconnect();
  }, [demoFs]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'monzy-time') {
        setDemoTime({ current: e.data.current, total: e.data.total });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };
  const emailRef = useRef(null);

  const scrollToForm = (e) => {
    e.preventDefault();
    emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 600);
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
          <svg width="28" height="28" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-logo-icon">
            <path d="M11.974 35C5.361 35 0 29.639 0 23.026V11.974C0 5.361 5.361 0 11.974 0H23.026C29.639 0 35 5.361 35 11.974V23.026C35 29.639 29.639 35 23.026 35H11.974Z" fill="#111111"/>
            <path d="M13.7021 15.125C16.7591 13.666 19.1901 11.156 20.5521 8.05396C19.6631 7.11996 18.5061 6.45296 17.2611 6.05296L16.5941 5.82996C16.5441 5.92696 16.5131 6.03296 16.5051 6.14096C15.4371 9.16696 13.2571 11.612 10.3231 12.991C8.27605 13.97 6.76405 15.749 6.05205 17.885L5.83105 18.551C5.92705 18.601 6.03305 18.631 6.14105 18.64C6.98705 18.951 7.83105 19.352 8.63205 19.842C9.78905 17.78 11.5621 16.13 13.7021 15.125ZM26.6031 15.304C24.9401 17.826 22.6161 19.841 19.8851 21.131C17.6181 22.199 15.8821 24.2 15.0821 26.602L14.8591 27.358C15.7231 28.124 16.7391 28.699 17.8401 29.048L18.5061 29.271C18.5571 29.174 18.5871 29.068 18.5961 28.959C19.6631 25.934 21.8431 23.488 24.7781 22.11C26.8241 21.131 28.3811 19.352 29.0491 17.216L29.2711 16.55C28.3371 16.283 27.4471 15.837 26.6031 15.304ZM13.0791 25.047C14.1871 22.37 16.2471 20.199 18.8621 18.952C21.2641 17.796 23.2651 16.018 24.6441 13.838C23.6211 12.859 22.7761 11.747 22.1541 10.413C20.4881 13.459 17.9041 15.903 14.7701 17.396C12.9461 18.241 11.4781 19.709 10.5881 21.488C11.5671 22.423 12.3681 23.579 12.9901 24.868L13.0791 25.047Z" fill="white"/>
          </svg>
          <span>Monzy</span>
        </a>
        <ul className="nav-links">
          <li><a href="#problem">The Problem</a></li>
          <li><a href="#agents">How it works</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#" className="nav-cta" onClick={scrollToForm}>Request Demo</a>
      </nav>

      {/* HERO */}
      <section className="hero-wrapper">
        <div className="hero-bg" />
        <div className="hero-ambient" aria-hidden="true">
          <span className="hero-blob hero-blob-1" />
          <span className="hero-blob hero-blob-2" />
          <span className="hero-blob hero-blob-3" />
          <span className="hero-blob hero-blob-4" />
        </div>
        <div className="hero">
          <FadeIn className="hero-card">
            <div className="corner-dot-tr" />
            <div className="corner-dot-bl" />
            <h1>Your AI <em>Accounts Receivables</em> specialist.</h1>
            <p className="hero-sub">
              AI agents that chase overdue invoices, match every incoming payment, and reconcile TDS deductions.
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
                {loading ? 'Submitting...' : 'Request Demo'}
              </button>
            </form>
            <p className={`form-message ${message.type}`}>{message.text}</p>
            <div className="hero-pills">
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><path d="M16 18l2-2-2-2" /><path d="M8 6L6 8l2 2" /><path d="M12 2v20" /></svg>
                50% DSO reduction
              </span>
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                3x AR capacity
              </span>
              <span className="hero-pill">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Zero manual matching
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem" id="problem">
        <FadeIn as="p" className="section-label">THE PROBLEM</FadeIn>
        <FadeIn as="h2" className="problem-heading">Work your AR team does<br />that software should</FadeIn>
        <FadeIn as="p" className="problem-sub">
          As your customer base grows, so does the manual work. Most of it is repetitive, error-prone, and completely automatable.
        </FadeIn>

        {/* Problem Row 1 — Follow-ups */}
        <FadeIn className="problem-row">
          <div className="problem-text">
            <div className="problem-tag">Collections</div>
            <h3>Sending the same follow-up for the 4th time</h3>
            <p>Your AR team copy-pastes the same email, changes the date, and hits send. Again. Some customers never reply. Escalations happen on instinct, not data. Every follow-up is a manual decision.</p>
          </div>
          <div className="problem-visual">
            <div className="mock-window">
              <div className="mock-titlebar">
                <span className="mock-dot red" /><span className="mock-dot yellow" /><span className="mock-dot green" />
                <span className="mock-title">Inbox</span>
              </div>
              <div className="mock-email-list">
                <div className="mock-email-item unread">
                  <div className="mock-avatar">YO</div>
                  <div className="mock-email-body">
                    <div className="mock-email-top">
                      <span className="mock-email-to">Priya Sharma</span>
                      <span className="mock-email-time">Today</span>
                    </div>
                    <div className="mock-email-subject">4th Reminder: INV-2847 · ₹2,40,000 overdue</div>
                  </div>
                </div>
                <div className="mock-email-item">
                  <div className="mock-avatar">YO</div>
                  <div className="mock-email-body">
                    <div className="mock-email-top">
                      <span className="mock-email-to">Priya Sharma</span>
                      <span className="mock-email-time">7 days ago</span>
                    </div>
                    <div className="mock-email-subject">3rd Reminder: INV-2847 · ₹2,40,000 overdue</div>
                  </div>
                </div>
                <div className="mock-email-item">
                  <div className="mock-avatar">YO</div>
                  <div className="mock-email-body">
                    <div className="mock-email-top">
                      <span className="mock-email-to">Priya Sharma</span>
                      <span className="mock-email-time">14 days ago</span>
                    </div>
                    <div className="mock-email-subject">2nd Reminder: INV-2847 · Payment pending</div>
                  </div>
                </div>
              </div>
              <div className="mock-alert warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                3 follow-ups sent. No reply. 45 days overdue.
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Problem Row 2 — TDS / Cash Application */}
        <FadeIn className="problem-row reverse">
          <div className="problem-visual">
            <div className="mock-window">
              <div className="mock-titlebar">
                <span className="mock-dot red" /><span className="mock-dot yellow" /><span className="mock-dot green" />
                <span className="mock-title">Payment Matching · January 2025</span>
              </div>
              <div className="mock-table">
                <div className="mock-table-header">
                  <span>Reference</span>
                  <span>Amount</span>
                  <span>Invoice</span>
                  <span>Status</span>
                </div>
                <div className="mock-table-row">
                  <span className="mock-ref">NEFT/88231...</span>
                  <span>₹87,200</span>
                  <span className="mock-inv">INV-2104</span>
                  <span className="mock-badge unmatched">Unmatched</span>
                </div>
                <div className="mock-table-row">
                  <span className="mock-ref">UPI/Ref44219</span>
                  <span>₹1,34,550</span>
                  <span className="mock-inv">INV-2091?</span>
                  <span className="mock-badge unmatched">Unmatched</span>
                </div>
                <div className="mock-table-row">
                  <span className="mock-ref">CHQ/003847</span>
                  <span>₹45,000</span>
                  <span className="mock-inv">INV-2118?</span>
                  <span className="mock-badge unmatched">Unmatched</span>
                </div>
                <div className="mock-table-row muted">
                  <span className="mock-ref">NEFT/91004...</span>
                  <span>₹2,16,000</span>
                  <span className="mock-inv">INV-2099</span>
                  <span className="mock-badge matched">Matched</span>
                </div>
              </div>
              <div className="mock-alert error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                INV-2104: ₹1,00,000 raised. ₹87,200 received. TDS deducted?
              </div>
            </div>
          </div>
          <div className="problem-text">
            <div className="problem-tag">Cash Application</div>
            <h3>Payments that never match the invoice</h3>
            <p>Customers deduct TDS and pay net. Payments arrive with no remittance advice. Your team spends hours cross-referencing bank statements, WhatsApp messages, and invoices just to figure out what each payment is for.</p>
          </div>
        </FadeIn>

        {/* Problem Row 3 — Credit Decisions */}
        <FadeIn className="problem-row">
          <div className="problem-text">
            <div className="problem-tag">Credit Management</div>
            <h3>Extending credit based on gut feel</h3>
            <p>Sales closes a deal and someone decides credit terms on instinct. No payment history, no risk score, no credit limit logic. Bad debt shows up months later, long after it could have been prevented.</p>
          </div>
          <div className="problem-visual">
            <div className="mock-window">
              <div className="mock-titlebar">
                <span className="mock-dot red" /><span className="mock-dot yellow" /><span className="mock-dot green" />
                <span className="mock-title">New Customer · Credit Evaluation</span>
              </div>
              <div className="mock-profile">
                <div className="mock-profile-header">
                  <div className="mock-profile-avatar">ZT</div>
                  <div>
                    <div className="mock-profile-name">Zenith Traders Pvt. Ltd.</div>
                    <div className="mock-profile-meta">Mumbai · Manufacturing</div>
                  </div>
                  <span className="mock-badge bounced-badge" style={{marginLeft:'auto', alignSelf:'flex-start'}}>High Risk</span>
                </div>
                <div className="mock-profile-fields">
                  <div className="mock-field">
                    <span className="mock-field-label">Credit Limit</span>
                    <span className="mock-field-value">₹5,00,000</span>
                  </div>
                  <div className="mock-field">
                    <span className="mock-field-label">Payment Terms</span>
                    <span className="mock-field-value">Net 60</span>
                  </div>
                  <div className="mock-field">
                    <span className="mock-field-label">Payment History</span>
                    <span className="mock-field-value muted-val">Unknown</span>
                  </div>
                  <div className="mock-field">
                    <span className="mock-field-label">Risk Assessment</span>
                    <span className="mock-field-value muted-val italic-val">"Seems fine, Rajan knows them"</span>
                  </div>
                  <div className="mock-field">
                    <span className="mock-field-label">Decision</span>
                    <span className="mock-badge matched">Approved</span>
                  </div>
                </div>
              </div>
              <div className="mock-alert error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ₹5,00,000 extended. First invoice unpaid at 90 days.
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* AGENTS */}
      <section className="agents" id="agents">
        <FadeIn as="p" className="section-label">HOW IT WORKS</FadeIn>
        <FadeIn as="h2">Three agents. Your entire AR lifecycle.</FadeIn>
        <FadeIn as="p" className="agents-sub">
          From deciding who gets credit, to chasing what's overdue, to matching every payment that comes in.
        </FadeIn>

        {/* Demo embed */}
        <FadeIn className={`demo-embed-wrap${demoFs ? ' demo-fs' : ''}`}>
          <iframe
            src="https://demo.monzyai.com"
            title="Monzy live demo"
            className={`demo-embed-iframe${demoFs ? ' demo-fs' : ''}`}
            allow="autoplay"
          />
          <div className="demo-overlay-controls">
            <span className="demo-time-badge">
              {fmtTime(demoTime.current)} / {fmtTime(demoTime.total)}
            </span>
            <button
              className="demo-fs-btn"
              onClick={() => setDemoFs(f => !f)}
              title={demoFs ? 'Minimize' : 'Fullscreen'}
              aria-label={demoFs ? 'Minimize demo' : 'Expand demo to fullscreen'}
            >
            {demoFs ? (
              /* compress icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
              </svg>
            ) : (
              /* expand icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
            )}
            </button>
          </div>
        </FadeIn>
        <div className="agents-grid">
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <h3>Collections Agent</h3>
            <p>Ranks every invoice by risk and payment history. Runs your follow-up sequences automatically. Escalates only when it needs a human.</p>
            <div className="agent-stat">40% faster collections</div>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 10h20M2 14h20M6 6l-4 4 4 4M18 6l4 4-4 4" />
              </svg>
            </div>
            <h3>Cash Application Agent</h3>
            <p>Matches every payment to the right invoice instantly. UPI, NEFT, RTGS, cheques, PDCs. Accounts for TDS deductions so your books never have a mismatch.</p>
            <div className="agent-stat">Zero manual matching</div>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Credit Agent</h3>
            <p>Evaluates every customer's creditworthiness before you extend terms. Sets credit limits. Flags risky buyers before they become a collections problem.</p>
            <div className="agent-stat">Prevent bad debt upfront</div>
          </FadeIn>
        </div>
        <FadeIn as="p" className="agents-more">and more agents built for your AR workflow.</FadeIn>

        <FadeIn className="metrics-grid">
          <div className="metric-item">
            <span className="metric-number">50%</span>
            <span className="metric-label">reduction in DSO</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">80%</span>
            <span className="metric-label">less time on manual follow-ups</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">3x</span>
            <span className="metric-label">more invoices per AR team member</span>
          </div>
        </FadeIn>
      </section>


      {/* FAQ */}
      <section className="faq" id="faq">
        <FadeIn as="p" className="section-label">FAQ</FadeIn>
        <FadeIn as="h2">Questions, answered</FadeIn>
        <FadeIn as="p" className="faq-sub">Everything you need to know before getting started.</FadeIn>
        <div className="faq-list">
          <FaqItem
            question="Do I need to replace my existing ERP or accounting software?"
            answer="No. Monzy integrates with Tally, Zoho Books, SAP, and other tools you already use. Our agents sit on top of your existing stack. No migration, no rip-and-replace."
            defaultOpen
          />
          <FaqItem
            question="How does TDS reconciliation work?"
            answer="When customers pay net of TDS, our Cash Application Agent automatically accounts for the deduction and matches the payment to the correct invoice. No manual adjustment or journal entry needed."
          />
          <FaqItem
            question="Which channels does Monzy use to follow up?"
            answer="Email, WhatsApp, and AI-powered phone calls. The Collections Agent learns which channel each customer actually responds to, and uses that channel going forward. No manual configuration needed."
          />
          <FaqItem
            question="How quickly can we get started?"
            answer="Most teams are live within 1 to 2 weeks, depending on the complexity of your existing process."
          />
          <FaqItem
            question="Which ERPs do you support?"
            answer="We currently support Tally, Zoho Books, QuickBooks, and SAP B1. If you're on a different ERP, reach out and we'll tell you what's possible."
          />
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="cta-section">
        <FadeIn className="cta-card">
          <div className="cta-ambient" aria-hidden="true">
            <span className="cta-blob cta-blob-1" />
            <span className="cta-blob cta-blob-2" />
            <span className="cta-blob cta-blob-3" />
          </div>
          <div className="corner-dot-tr" />
          <div className="corner-dot-bl" />
          <p className="section-label" style={{ marginBottom: '16px' }}>GET STARTED</p>
          <h2 className="cta-heading">Your AR team will thank you.</h2>
          <p className="cta-sub">Join finance teams already using Monzy to collect faster and reconcile automatically.</p>
          <form className="hero-form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email address"
              autoComplete="email"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Request Demo'}
            </button>
          </form>
          <p className={`form-message ${message.type}`}>{message.text}</p>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 TidalPeak Labs Private Ltd. All rights reserved.</span>
          <span className="footer-made-in">🇮🇳 Made in India, for India.</span>
        </div>
      </footer>
    </>
  );
}
