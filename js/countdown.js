document.addEventListener('DOMContentLoaded', function() {
  const wedding = new Date('2026-07-19T15:30:00');
  const now = new Date();
  const diff = Math.ceil((wedding - now) / (1000 * 60 * 60 * 24));
  const daysEl = document.getElementById('days-count');
  const txtEl = document.getElementById('countdown-text');

  if (diff > 0) {
    daysEl.textContent = diff;
  } else if (diff === 0) {
    txtEl.innerHTML = '<strong>Сегодня наш день! ♡</strong>';
  } else {
    txtEl.innerHTML = 'Мы уже семья! ♡';
  }
});