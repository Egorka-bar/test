document.addEventListener('DOMContentLoaded', function() {
  window.submitRSVP = function() {
    const name = document.getElementById('rsvp-name').value.trim();
    const attend = document.getElementById('rsvp-attend').value;
    const wish = document.getElementById('rsvp-wish').value.trim();
    const music = document.getElementById('rsvp-music').value.trim();

    if (!name || !attend) {
      alert('Пожалуйста, заполните имя и выберите ответ');
      return;
    }

    const subject = encodeURIComponent('Подтверждение на свадьбу от ' + name);
    const body = encodeURIComponent(
      'Имя: ' + name + '\n' +
      'Ответ: ' + attend + '\n' +
      'Пожелания: ' + (wish || 'нет') + '\n' +
      'Музыкальные пожелания: ' + (music || 'нет') + '\n\n' +
      'С уважением, ваш гость.'
    );
    window.location.href = 'mailto:your-email@example.com?subject=' + subject + '&body=' + body;

    document.getElementById('rsvp-form-wrap').style.display = 'none';
    const success = document.getElementById('rsvp-success');
    document.getElementById('rsvp-name-display').textContent = name.split(' ')[0];
    success.style.display = 'block';
  };
});