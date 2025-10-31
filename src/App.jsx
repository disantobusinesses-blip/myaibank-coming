import { useEffect, useMemo, useState } from 'react';

const BREVO_LIST_ID = 5;

const featureGroups = [
  {
    heading: 'Real results',
    title: 'Real results for everyday money goals.',
    copy:
      'MyAiBank gives you a real-time command center for every decision—so you can stash more, pay down faster, and stay in sync with the life you want.',
    features: [
      {
        title: 'Subscription hunter',
        description:
          'Surface forgotten auto-renewals, suggest downgrades, and instantly redirect savings to your goals.',
      },
      {
        title: 'Smarter net worth tracking',
        description:
          'See the delta between assets and liabilities alongside surplus cash flow—updated every time a transaction lands.',
      },
      {
        title: 'Guided surplus automation',
        description:
          'Our AI nudges prompt extra deposits when you’re ahead of budget so your savings momentum never stalls.',
      },
      {
        title: 'Shared money rhythms',
        description:
          'Invite partners to view shared dashboards, leave notes, and celebrate wins in a single, secure space.',
      },
    ],
  },
  {
    heading: 'Launch day',
    title: 'What you can expect on day one.',
    copy: 'Connect accounts in minutes, get a personalized savings playbook, and let MyAiBank run the heavy lifting.',
    features: [
      {
        title: 'Instant account sync',
        description:
          'Securely connect your banks and credit cards to see balances, spending, and surplus in one place.',
      },
      {
        title: 'AI coaching moments',
        description:
          'Unlock the MyAiBank coach for actionable nudges based on your financial wellness score.',
      },
      {
        title: 'Goal progress snapshots',
        description:
          'Dynamic tiles show how each goal is trending so you can course-correct before month end.',
      },
      {
        title: 'Family mode ready',
        description:
          'Share budgets, allowances, and savings streaks with household members with granular controls.',
      },
    ],
  },
];

const countdownLabels = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
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

export default function App() {
  const countdown = useCountdown();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
    } catch (error) {
      setStatus('error');
      setErrorMessage('We hit a network issue while connecting to Brevo. Please try again.');
    }
  }

  return (
    <div className="page-shell">
      <header className="navbar">
        <div className="brand">MyAiBank</div>
      </header>

      <main>
        <section className="hero">
          <div className="floating-orb" aria-hidden="true" />
          <div className="hero__layout">
            <div className="hero__content">
              <span className="eyebrow">Financial wellness platform</span>
              <h1 className="hero__headline">AI-powered savings that grow with you.</h1>
              <p className="hero__description">
                Give every dollar a job with automated insights that rebalance spending, grow savings, and reveal new surplus
                every time you get paid. Launching December 1.
              </p>
              <div className="countdown" aria-live="polite">
                {countdownLabels.map(([key, label]) => (
                  <div className="countdown__tile" key={key}>
                    <div className="countdown__value">{countdown[key]}</div>
                    <div className="countdown__label">{label}</div>
                  </div>
                ))}
              </div>

              <form className="newsletter" onSubmit={handleSubmit} noValidate>
                <label htmlFor="email">Receive a free budgeting template and stay up to date with news</label>
                <div className="newsletter__control">
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
                    {status === 'submitting' ? 'Joining…' : 'Join the newsletter'}
                  </button>
                </div>
                {status === 'idle' && (
                  <p className="newsletter__hint">No spam—just launch updates and actionable money prompts.</p>
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

            <div className="hero__preview" aria-hidden="true">
              <div className="device-card">
                <div className="device-top">
                  <div>
                    <div className="device-title">Demo User wellness score</div>
                    <div className="device-subtitle">
                      Score updates automatically whenever new transactions sync.
                    </div>
                  </div>
                  <span className="tag">Financial wellness</span>
                </div>
                <div className="metric-group">
                  <div className="metric-title">Score today</div>
                  <div className="metric-value">
                    71<span className="metric-denominator">/100</span>
                  </div>
                  <div className="metric-subtitle">
                    Above the preferred range. Direct surplus income to the largest balance.
                  </div>
                </div>
                <div className="metric-columns">
                  <div className="metric-group">
                    <div className="metric-title">Debt-to-income</div>
                    <div className="metric-value emphasized">38.7%</div>
                    <div className="metric-subtitle">
                      Monthly debt A$7,663.54 vs income A$19,800.00. Target: 36% or below. Excellent if under 25%.
                    </div>
                  </div>
                  <div className="metric-group">
                    <div className="metric-title">30/30/20 rule</div>
                    <div className="metric-subtitle">
                      Ensure essentials, growth, and surplus buckets are balanced for every pay cycle.
                    </div>
                  </div>
                </div>
              </div>

              <div className="device-card light">
                <div className="device-top">
                  <div>
                    <div className="device-title">Spending &amp; net worth</div>
                    <div className="device-subtitle">
                      Split view shows cash available today and the bigger picture across savings, mortgages, and debt.
                    </div>
                  </div>
                  <span className="tag">Balance summary</span>
                </div>
                <div className="metric-group">
                  <div className="metric-title">Spending available</div>
                  <div className="metric-value">A$20,679.34</div>
                  <div className="metric-subtitle">
                    Includes checking and savings accounts you can access immediately.
                  </div>
                </div>
                <div className="metric-group">
                  <div className="metric-title">Total net worth</div>
                  <div className="metric-value negative">−A$757,511.34</div>
                  <div className="metric-subtitle">Assets minus liabilities. Track progress every time new data syncs.</div>
                </div>
                <div className="double-metric">
                  <div className="metric-group">
                    <div className="metric-title">Mortgage &amp; debt</div>
                    <div className="metric-value">A$778,190.68</div>
                    <div className="metric-subtitle">
                      Keep every obligation visible so nothing slips through the cracks.
                    </div>
                  </div>
                  <div className="metric-group">
                    <div className="metric-title">Transactions</div>
                    <div className="metric-value">14,000</div>
                    <div className="metric-subtitle">Auto-categorized with AI for faster reviews and insights.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {featureGroups.map((group) => (
          <section className="section" key={group.heading}>
            <div className="section-heading">
              <span>{group.heading}</span>
              <h2>{group.title}</h2>
              <p>{group.copy}</p>
            </div>
            <div className="feature-grid">
              {group.features.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <strong>{feature.title}</strong>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="section">
          <div className="section-heading">
            <span>Inside the experience</span>
            <h2>Inside the experience.</h2>
            <p>Powerful dashboards are ready from day one—built from the same views you saw in the product preview.</p>
          </div>
          <div className="experience-showcase" aria-hidden="true">
            <div className="device-card">
              <div className="device-top">
                <div>
                  <div className="device-title">Demo User wellness score</div>
                  <div className="device-subtitle">Need a tour?</div>
                </div>
                <span className="tag">Financial wellness</span>
              </div>
              <div className="metric-group">
                <div className="metric-title">Score today</div>
                <div className="metric-value">
                  71<span className="metric-denominator">/100</span>
                </div>
                <div className="metric-subtitle">Score updates automatically whenever new transactions sync.</div>
              </div>
              <div className="metric-columns">
                <div className="metric-group">
                  <div className="metric-title">Debt-to-income</div>
                  <div className="metric-value emphasized">38.7%</div>
                  <div className="metric-subtitle">
                    Above the preferred range. Direct surplus income to the largest balance.
                  </div>
                </div>
                <div className="metric-group">
                  <div className="metric-title">30/30/20 rule</div>
                  <div className="metric-subtitle">Automate essentials, quality-of-life upgrades, and future you.</div>
                </div>
              </div>
            </div>
            <div className="device-card light">
              <div className="device-top">
                <div>
                  <div className="device-title">Spending &amp; net worth</div>
                  <div className="device-subtitle">Balance summary</div>
                </div>
                <span className="tag">Net worth</span>
              </div>
              <div className="metric-group">
                <div className="metric-title">Spending available</div>
                <div className="metric-value">A$20,679.34</div>
                <div className="metric-subtitle">
                  Includes checking and savings accounts you can access immediately.
                </div>
              </div>
              <div className="metric-group">
                <div className="metric-title">Total net worth</div>
                <div className="metric-value negative">−A$757,511.34</div>
                <div className="metric-subtitle">Assets minus liabilities. Track progress every time new data syncs.</div>
              </div>
              <div className="double-metric">
                <div className="metric-group">
                  <div className="metric-title">Mortgage &amp; debt</div>
                  <div className="metric-value">A$778,190.68</div>
                </div>
                <div className="metric-group">
                  <div className="metric-title">Transactions</div>
                  <div className="metric-value">14,000</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} MyAiBank. All rights reserved.</span>
        <span>Launching December 1.</span>
      </footer>
    </div>
  );
}
