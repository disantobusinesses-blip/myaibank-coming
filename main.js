import { Analytics } from '@vercel/analytics/next';

if (typeof window !== 'undefined') {
  try {
    Analytics();
  } catch (analyticsError) {
    console.warn('[Vercel Analytics] init failed', analyticsError);
  }
}

const easeOutQuad = (t) => t * (2 - t);

function animateValue(element, target, { duration = 1200, prefix = '', suffix = '', decimals = 0 } = {}) {
  const startValue = Number.parseFloat(element.dataset.currentValue || '0') || 0;
  const startTime = performance.now();
  const delta = target - startValue;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutQuad(progress);
    const currentValue = startValue + delta * eased;
    element.textContent = `${prefix}${formatter.format(currentValue)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.dataset.currentValue = String(target);
    }
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  counterElements.forEach((element) => {
    const target = Number.parseFloat(element.dataset.counterTarget || '0');
    const prefix = element.dataset.counterPrefix || '';
    const suffix = element.dataset.counterSuffix || '';
    const decimals = Number.parseInt(element.dataset.counterDecimals || '0', 10);
    if (!Number.isNaN(target)) {
      animateValue(element, target, { prefix, suffix, decimals });
    }
  });
}

function initParticles() {
  const field = document.getElementById('particle-field');
  if (!field) return;

  const particleCount = 40;

  const resetParticle = (particle) => {
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${-Math.random() * 80}px`;
    const duration = 14 + Math.random() * 14;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * -duration}s`;
    particle.style.opacity = `${0.3 + Math.random() * 0.4}`;
  };

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement('span');
    resetParticle(particle);
    particle.addEventListener('animationend', () => {
      resetParticle(particle);
    });
    field.appendChild(particle);
  }
}

function initPointerGlow() {
  const glow = document.querySelector('.pointer-glow');
  if (!glow) return;

  const update = (x, y) => {
    glow.style.setProperty('--pointer-x', `${x}px`);
    glow.style.setProperty('--pointer-y', `${y}px`);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      update(event.clientX, event.clientY + window.scrollY);
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      update(window.innerWidth * 0.5, window.scrollY + window.innerHeight * 0.25);
    },
    { passive: true }
  );
}

function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    elements.forEach((element) => {
      const depth = Number.parseFloat(element.dataset.depth || '0.15');
      const offset = scrollY * depth * -0.12;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initDemo() {
  const form = document.getElementById('rule-form');
  if (!form) return;

  const incomeInput = document.getElementById('income');
  const spendingInput = document.getElementById('spending');
  const outputs = {
    essentials: document.querySelector('[data-output="essentials"]'),
    wants: document.querySelector('[data-output="wants"]'),
    savings: document.querySelector('[data-output="savings"]'),
    dti: document.querySelector('[data-output="dti"]'),
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const income = Number.parseFloat(incomeInput?.value || '0');
    const spending = Number.parseFloat(spendingInput?.value || '0');

    if (!income || income <= 0) {
      form.reportValidity();
      return;
    }

    const essentials = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;
    const dtiRatio = income ? (spending / income) * 100 : 0;

    if (outputs.essentials) {
      animateValue(outputs.essentials, essentials, {
        prefix: '$',
        decimals: 2,
        duration: 900,
      });
    }

    if (outputs.wants) {
      animateValue(outputs.wants, wants, {
        prefix: '$',
        decimals: 2,
        duration: 900,
      });
    }

    if (outputs.savings) {
      animateValue(outputs.savings, savings, {
        prefix: '$',
        decimals: 2,
        duration: 900,
      });
    }

    if (outputs.dti) {
      animateValue(outputs.dti, dtiRatio, {
        suffix: '%',
        decimals: 1,
        duration: 900,
      });
    }

    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card) => {
      card.classList.remove('is-active');
      void card.offsetWidth;
      card.classList.add('is-active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initParticles();
  initPointerGlow();
  initParallax();
  initDemo();
});
