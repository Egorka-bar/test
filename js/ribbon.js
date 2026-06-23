document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('ribbon-track');
  
  // Дублируем содержимое 4 раза для непрерывной анимации
  const content = track.innerHTML;
  track.innerHTML = content + content + content + content;
});