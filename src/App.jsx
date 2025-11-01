import { useEffect, useMemo, useRef, useState } from 'react';

const BREVO_LIST_ID = 5;

const countdownLabels = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
];

const toolCards = [
  {
    name: 'Subscription Hunter',
    tagline: 'Find recurring expenses instantly',
    description:
      'We automatically surface forgotten subscriptions, identify duplicate services, and recommend immediate actions to reclaim cash.',
    placeholder: 'Add your Subscription Hunter screenshot in this panel.',
  },
  {
    name: 'Savings Forecast',
    tagline: 'AI predicts your savings growth',
    description:
      'Connect your accounts to see projected balances, surplus momentum, and goal completion dates powered by MyAiBank intelligence.',
    placeholder: 'Add your Savings Forecast screenshot in this panel.',
  },
  {
    name: 'Financial Wellness Card',
    tagline: 'View last 30 days income, savings, and spending advice',
    description:
      'Track income, net worth shifts, and smart recommendations in one monthly snapshot that adapts to your cash flow.',
    placeholder: 'Add your Financial Wellness screenshot in this panel.',
  },
];

function useCountdown() {
  const targetDate = useMemo(() => {
    const now = new Date();
    const launchMonthIndex = 11; // December
    const isAfterLaunch =
      now.getMonth() > launchMonthIndex ||
      (now.getMonth() === launchMonthIndex && now.getDate() >= 1);
    const year = isAfterLaunch ? now.getFullYear() + 1 : now.getFullYear();
    return new Date(`${year}-12-01T00:00:00`);
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => computeCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(computeCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function computeCountdown(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

function CountdownValue({ value }) {
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setPulsing(true);
    const timeout = setTimeout(() => setPulsing(false), 350);
    return () => clearTimeout(timeout);
  }, [value]);

  return <div className={`countdown__value${pulsing ? ' countdown__value--pulse' : ''}`}>{value}</div>;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function AnimatedNumber({ value, formatter, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const initial = previousValue.current;
    const delta = value - initial;
    const duration = 900;

    let rafId;

    const step = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(initial + delta * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    previousValue.current = value;

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [value]);

  return <span>{formatter(displayValue)}{suffix}</span>;
}

export default function App() {
  const heroRef = useRef(null);
  const countdown = useCountdown();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [income, setIncome] = useState('');
  const [spending, setSpending] = useState('');
  const [demoError, setDemoError] = useState('');
  const [budgetResult, setBudgetResult] = useState(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 32 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 12 + Math.random() * 12,
        delay: Math.random() * -20,
        size: 2 + Math.random() * 3,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  );

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      hero.style.setProperty('--cursor-x', `${x}px`);
      hero.style.setProperty('--cursor-y', `${y}px`);
      hero.style.setProperty('--cursor-opacity', '1');
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    const handlePointerLeave = () => {
      hero.style.setProperty('--cursor-opacity', '0');
    };

    hero.addEventListener('pointermove', handlePointerMove);
    hero.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      hero.removeEventListener('pointermove', handlePointerMove);
      hero.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      doc.style.setProperty('--scroll-progress', progress.toString());
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const brevoApiKey = import.meta.env.VITE_BREVO_KEY?.trim();

    if (!brevoApiKey) {
      setStatus('error');
      setErrorMessage('Newsletter signups are temporarily unavailable. Please configure the Brevo API key.');
      return;
    }

    const normalizedEmail = email.trim();

    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          listIds: [BREVO_LIST_ID],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        let message = '';
        try {
          const payload = await response.json();
          message =
            payload?.message ||
            payload?.errors?.[0]?.message ||
            payload?.code ||
            '';
        } catch (_error) {
          message = '';
        }

        setStatus('error');
        setErrorMessage(
          message
            ? `We couldn’t add that email yet: ${message}`
            : 'We couldn’t reach Brevo right now. Please try again in a moment.'
        );
        return;
      }

      setStatus('success');
      setEmail('');
      setErrorMessage('');
    } catch (_error) {
      setStatus('error');
      setErrorMessage('We hit a network issue while connecting to Brevo. Please try again.');
    }
  }

  function handleDemoSubmit(event) {
    event.preventDefault();
    const parsedIncome = Number(income);
    const parsedSpending = Number(spending);

    if (!Number.isFinite(parsedIncome) || !Number.isFinite(parsedSpending) || parsedIncome <= 0 || parsedSpending < 0) {
      setDemoError('Enter valid amounts for income and spending to explore the demo.');
      setBudgetResult(null);
      return;
    }

    setDemoError('');
    setBudgetResult({
      income: parsedIncome,
      spending: parsedSpending,
      essentials: parsedIncome * 0.5,
      wants: parsedIncome * 0.3,
      savings: parsedIncome * 0.2,
      debtToIncome: (parsedSpending / parsedIncome) * 100,
    });
  }

  return (
    <div className="page-shell">
      <div className="animated-gradient" aria-hidden="true" />
      <div className="particle-field" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              '--particle-left': `${particle.left}%`,
              '--particle-top': `${particle.top}%`,
              '--particle-duration': `${particle.duration}s`,
              '--particle-delay': `${particle.delay}s`,
              '--particle-size': `${particle.size}px`,
              '--particle-opacity': particle.opacity,
            }}
          />
        ))}
      </div>

      <header className="navbar" data-depth style={{ '--parallax-depth': '40px' }}>
        <div className="brand">MyAiBank</div>
        <span className="nav-domain">myaibank.ai</span>
      </header>

      <main>
        <section className="hero" ref={heroRef} data-depth style={{ '--parallax-depth': '70px' }}>
          <div className="hero__content">
            <div className="hero__badge">Experience the Future of Budgeting.</div>
            <h1>
              AI-guided money management that helps you plan, predict, and win every budget cycle.
            </h1>
            <p>
              MyAiBank monitors your cash flow, spots hidden subscriptions, and projects savings in real time so you always know the next best move.
            </p>
            <div className="hero__banner">
              <span className="hero__banner-title">Experience the Future of Budgeting.</span>
              <span className="hero__banner-offer">First 500 users get 25% off for 6 months.</span>
            </div>
            <div className="hero__countdown" aria-live="polite">
              {countdownLabels.map(([key, label]) => (
                <div className="countdown__tile" key={key}>
                  <CountdownValue value={countdown[key]} />
                  <div className="countdown__label">{label}</div>
                </div>
              ))}
            </div>

            <div className="newsletter" aria-labelledby="newsletter-title">
              <h2 id="newsletter-title">Join the newsletter</h2>
              <p className="newsletter__intro">
                Receive a free budgeting template and stay up to date with news from MyAiBank.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <div className="newsletter__controls">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status !== 'idle') {
                        setStatus('idle');
                        setErrorMessage('');
                      }
                    }}
                    required
                  />
                  <button type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
                  </button>
                </div>
                {status === 'idle' && (
                  <p className="newsletter__hint">No spam—just AI budgeting guidance and launch updates.</p>
                )}
                {status === 'success' && (
                  <p className="newsletter__success" role="status">
                    You’re on the list! Check your inbox for the budgeting template.
                  </p>
                )}
                {status === 'error' && (
                  <p className="newsletter__error" role="alert">
                    {errorMessage || 'We couldn’t connect to Brevo just now. Please try again later.'}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__visual-card">
              <div className="hero__visual-placeholder">
                <p>Drop a hero screenshot to showcase AI budgeting targets.</p>
              </div>
              <div className="hero__visual-overlay">
                <p>Preview AI budgeting targets before launch.</p>
              </div>
            </div>
            <div className="hero__visual-card">
              <div className="hero__visual-placeholder">
                <p>Drop a hero screenshot for the financial wellness insights.</p>
              </div>
              <div className="hero__visual-overlay">
                <p>See 30-day income, net worth, and savings insights instantly.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="demo" data-depth style={{ '--parallax-depth': '50px' }}>
          <div className="demo__copy">
            <h2>The 50/30/20 Rule Demo</h2>
            <p>
              Test-drive how MyAiBank balances your take-home pay. Enter your monthly income and spending to see targets for
              essentials, lifestyle, and savings in seconds.
            </p>
            <ul className="demo__tips">
              <li>If paid weekly, multiply your weekly after-tax wage by 4.</li>
              <li>Check your bank statement or estimate your monthly spending.</li>
            </ul>
            <form className="demo__form" onSubmit={handleDemoSubmit}>
              <label htmlFor="income">Your monthly income (after tax)</label>
              <input
                id="income"
                name="income"
                type="number"
                min="0"
                step="0.01"
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                placeholder="e.g. 5500"
                required
              />
              <label htmlFor="spending">Your total monthly spending</label>
              <input
                id="spending"
                name="spending"
                type="number"
                min="0"
                step="0.01"
                value={spending}
                onChange={(event) => setSpending(event.target.value)}
                placeholder="e.g. 3200"
                required
              />
              <button type="submit">Calculate my plan</button>
              {demoError && (
                <p className="demo__error" role="alert">
                  {demoError}
                </p>
              )}
            </form>
          </div>

          <div className="demo__results">
            {budgetResult ? (
              <div className="demo__cards">
                <article className="demo-card" data-tooltip="Balanced budget target">
                  <h3>Essentials</h3>
                  <p className="demo-card__percentage">50%</p>
                  <p className="demo-card__value">
                    <AnimatedNumber value={budgetResult.essentials} formatter={currencyFormatter} />
                  </p>
                  <p className="demo-card__meta">Cover housing, groceries, transport, and healthcare with confidence.</p>
                </article>
                <article className="demo-card" data-tooltip="Balanced budget target">
                  <h3>Wants</h3>
                  <p className="demo-card__percentage">30%</p>
                  <p className="demo-card__value">
                    <AnimatedNumber value={budgetResult.wants} formatter={currencyFormatter} />
                  </p>
                  <p className="demo-card__meta">Spend intentionally on dining, entertainment, and subscriptions.</p>
                </article>
                <article className="demo-card" data-tooltip="Balanced budget target">
                  <h3>Savings</h3>
                  <p className="demo-card__percentage">20%</p>
                  <p className="demo-card__value">
                    <AnimatedNumber value={budgetResult.savings} formatter={currencyFormatter} />
                  </p>
                  <p className="demo-card__meta">Build emergency funds, investments, and future goals faster.</p>
                </article>
                <article className="demo-card" data-tooltip="Debt-to-Income insight">
                  <h3>Debt-to-Income ratio</h3>
                  <p className="demo-card__value demo-card__value--accent">
                    <AnimatedNumber
                      value={budgetResult.debtToIncome}
                      formatter={(number) => percentFormatter(number / 100)}
                    />
                  </p>
                  <p className="demo-card__meta">
                    MyAiBank flags risk as you approach 36% and celebrates when you stay below 25%.
                  </p>
                </article>
              </div>
            ) : (
              <div className="demo__placeholder">
                <p>Submit your numbers to unlock glowing AI recommendations in real-time.</p>
              </div>
            )}
          </div>
        </section>

        <section className="tools" data-depth style={{ '--parallax-depth': '45px' }}>
          <div className="tools__header">
            <h2>Active Tool Displays</h2>
            <p>
              Preview how MyAiBank’s AI budgeting suite keeps you ahead—from identifying hidden subscriptions to forecasting
              savings and tracking wellness.
            </p>
          </div>
          <div className="tool-carousel" role="list">
            {toolCards.map((tool) => (
              <article key={tool.name} className="tool-card" role="listitem">
                <div className="tool-card__copy">
                  <h3>{tool.name}</h3>
                  <p className="tool-card__tagline">{tool.tagline}</p>
                  <p>{tool.description}</p>
                </div>
                <div className="tool-card__media">
                  <p className="tool-card__placeholder">{tool.placeholder}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">Powered by MyAiBank.ai – All rights reserved</footer>
    </div>
  );
}
