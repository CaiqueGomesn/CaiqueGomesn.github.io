// timeline.js — accordion acessível + animação de entrada sem bibliotecas externas.
document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('[data-career-timeline]');
  if (!timeline) return;

  const stops = [...timeline.querySelectorAll('[data-career-stop]')];
  const triggers = stops.map((stop) => stop.querySelector('.career-stop__trigger'));

  // Mantém apenas um card expandido por vez.
  function toggleStop(trigger) {
    const details = document.getElementById(trigger.getAttribute('aria-controls'));
    const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

    triggers.forEach((otherTrigger) => {
      const otherDetails = document.getElementById(otherTrigger.getAttribute('aria-controls'));
      otherTrigger.setAttribute('aria-expanded', String(otherTrigger === trigger && willOpen));
      otherDetails.hidden = !(otherTrigger === trigger && willOpen);
    });

    if (willOpen) details.focus?.({ preventScroll: true });
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => toggleStop(trigger));
    // Setas tornam a navegação pelo teclado natural em uma sequência de fases.
    trigger.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      triggers[(index + direction + triggers.length) % triggers.length].focus();
    });
  });

  // Revela cada parada quando ela entra na viewport, preservando fallback sem JS.
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stops.forEach((stop) => stop.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  stops.forEach((stop) => observer.observe(stop));
});
