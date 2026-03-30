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
  const emailRef = useRef(null);

  const scrollToForm = (e) => {
    e.preventDefault();
    emailRef.current?.focus({ preventScroll: false });
    emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        <a href="#" className="nav-cta" onClick={scrollToForm}>Get Early Access</a>
      </nav>

      {/* HERO */}
      <section className="hero-wrapper">
        <div className="hero-bg" />
        <div className="hero">
          <FadeIn className="hero-card">
            <div className="corner-dot-tr" />
            <div className="corner-dot-bl" />
            <h1>AI Agents for <em>Accounts Receivables</em></h1>
            <p className="hero-sub">
              AI agents that cut DSO by 50%, eliminate cash application errors, and give
              your AR team 3x the capacity, without adding headcount.
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
                {loading ? 'Submitting...' : 'Get Early Access'}
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

      {/* AGENTS */}
      <section className="agents" id="agents">
        <FadeIn as="p" className="section-label">WHAT YOU GET</FadeIn>
        <FadeIn as="h2">Your entire AR workflow, <em>automated</em></FadeIn>
        <FadeIn as="p" className="agents-sub">
          From credit decisions to cash in your account.
        </FadeIn>
        <div className="agents-grid">
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <h3>Collections Agent</h3>
            <p>Ranks invoices by risk. Runs your entire follow-up sequence. Escalates only what needs you.</p>
            <div className="agent-stat">40% faster payments</div>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 10h20M2 14h20M6 6l-4 4 4 4M18 6l4 4-4 4" />
              </svg>
            </div>
            <h3>Cash Application Agent</h3>
            <p>Matches every payment to the right invoice instantly. UPI, NEFT, cheques, PDCs, TDS deductions included.</p>
            <div className="agent-stat">Zero manual matching</div>
          </FadeIn>
          <FadeIn className="agent-card">
            <div className="agent-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Credit Agent</h3>
            <p>Evaluates creditworthiness before you extend terms. Flags risky buyers before they default.</p>
            <div className="agent-stat">Prevent bad debt upfront</div>
          </FadeIn>
        </div>
        <FadeIn as="p" className="agents-more">......and more agents built for your AR workflow.</FadeIn>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <FadeIn as="p" className="section-label">FAQ</FadeIn>
        <FadeIn as="h2">Here to help with<br />all your <em>questions</em></FadeIn>
        <FadeIn as="p" className="faq-sub">Everything you need to know<br />before getting started.</FadeIn>
        <div className="faq-list">
          <FaqItem
            question="Do I need to replace my existing ERP or accounting software?"
            answer="No. Monzy integrates with Tally, Zoho Books, SAP, and other tools you already use. Our agents sit on top of your existing stack. No migration, no rip-and-replace."
            defaultOpen
          />
          <FaqItem
            question="How does TDS reconciliation work?"
            answer="When customers pay net of TDS, our Cash Application Agent automatically accounts for the deduction and matches the payment to the correct invoice. No manual adjustment or journal entry needed."
            defaultOpen
          />
          <FaqItem
            question="How quickly can we get started?"
            answer="Most teams are live within 1-2 weeks, depending on the complexity of your existing process."
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
            <p className="footer-tagline">AI agents for accounts receivable.</p>
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
