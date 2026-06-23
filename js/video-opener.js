document.addEventListener('DOMContentLoaded', function() {

  document.body.classList.add('body-no-scroll');

  const openButton = document.getElementById('open-video-button');
  const videoOpener = document.getElementById('video-opener');
  const envelopeVideo = document.getElementById('envelope-video');
  const mainWrapper = document.getElementById('main-content-wrapper');

  function hideOpener() {
    if (videoOpener.style.opacity === '0') return;
    videoOpener.style.opacity = '0';
    mainWrapper.style.display = 'block';
    requestAnimationFrame(function() {
      mainWrapper.style.opacity = '1';
    });
    document.body.classList.remove('body-no-scroll');
    setTimeout(function() {
      videoOpener.style.display = 'none';
    }, 800);
  }

  openButton.addEventListener('click', function() {
    openButton.classList.add('hidden');

    let timeoutId = setTimeout(function() {
      if (videoOpener.style.opacity !== '0') {
        console.warn('Видео не запустилось, показываем контент по таймауту.');
        hideOpener();
      }
    }, 5000);

    const playPromise = envelopeVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(function() {
        clearTimeout(timeoutId);
      }).catch(function(error) {
        console.warn('Ошибка воспроизведения видео:', error);
      });
    }
  });

  envelopeVideo.addEventListener('ended', function() {
    hideOpener();
  });

  envelopeVideo.addEventListener('error', function() {
    setTimeout(hideOpener, 3000);
  });

});