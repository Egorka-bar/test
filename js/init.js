document.addEventListener('DOMContentLoaded', function() {

  // Выделение ячейки календаря
  document.querySelectorAll('.cal-cell').forEach(function(cell) {
    if (cell.textContent.trim() === '19') {
      cell.classList.add('active');
    }
  });

  // Reveal-анимации
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(function(el) { observer.observe(el); });

  // Timeline-анимации
  const tlObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        const items = e.target.querySelectorAll('.tl-item');
        items.forEach(function(item, i) {
          setTimeout(function() {
            item.classList.add('visible');
          }, i * 160);
        });
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.timeline').forEach(function(el) {
    tlObserver.observe(el);
  });

});