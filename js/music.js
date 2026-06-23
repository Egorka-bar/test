document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    // Функция обновления интерфейса
    function updateUI(state) {
        if (state === 'playing') {
            toggleBtn.classList.remove('paused');
            toggleBtn.classList.add('playing');
            isPlaying = true;
        } else {
            toggleBtn.classList.remove('playing');
            toggleBtn.classList.add('paused');
            isPlaying = false;
        }
    }

    // Устанавливаем начальное состояние — пауза
    updateUI('paused');

    // Пытаемся запустить аудио при загрузке
    audio.volume = 0.4;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Автозапуск удался
            updateUI('playing');
        }).catch(() => {
            // Автозапуск заблокирован — остаёмся в паузе
            updateUI('paused');
            console.log('Нажмите на пластинку, чтобы включить музыку');
        });
    }

    // Клик по иконке — переключение
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isPlaying) {
            audio.pause();
            updateUI('paused');
        } else {
            audio.play()
                .then(() => {
                    updateUI('playing');
                })
                .catch(() => {
                    // Если по какой-то причине не удалось запустить
                    updateUI('paused');
                });
        }
    });

    // При окончании трека — перезапускаем
    audio.addEventListener('ended', function() {
        if (isPlaying) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    });
});