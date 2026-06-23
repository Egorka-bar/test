$(function() {
  'use strict';

  // ---------- ВАШИ ФОТОГРАФИИ ----------
  const CAROUSEL_IMAGES = [
    'assets/1.jpg',
    'assets/2.jpg',
    'assets/3.jpg',
    'assets/4.jpg',
    'assets/5.jpg',
    'assets/6.jpg',
    'assets/7.jpg',
    'assets/8.jpg',
    'assets/9.jpg',
    'assets/10.jpg'
  ];

  // ---------- КОНФИГ ----------
  const IMG_COUNT = CAROUSEL_IMAGES.length;
  const RADIUS = 350;
  const ANGLE_STEP = 360 / IMG_COUNT;
  const ROTATION_SPEED = 0.10;

  let currentRotation = 0;
  let animationFrame = null;
  let lastTime = 0;

  // ---------- ИНИЦИАЛИЗАЦИЯ ----------
  const images = document.querySelectorAll('.carousel-img');
  const ring = document.getElementById('carousel-ring');

  images.forEach((img, i) => {
    const angle = i * -ANGLE_STEP;
    img.style.transform = `rotateY(${angle}deg) translateZ(${-RADIUS}px)`;
    img.style.transformOrigin = 'center center';
    img.style.backgroundImage = `url(${CAROUSEL_IMAGES[i]})`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    img.style.backfaceVisibility = 'hidden';
    img.style.opacity = '0';
  });

  const tl = gsap.timeline();

  tl.set('#carousel-ring', {
    rotationY: 0
  });

  tl.to('.carousel-img', {
    opacity: 1,
    duration: 1.5,
    stagger: 0.1,
    ease: 'expo',
    onComplete: function() {
      lastTime = 0;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(autoRotate);
    }
  });

  // Эффект наведения
  $('.carousel-img').on('mouseenter', function(e) {
    const current = e.currentTarget;
    gsap.to('.carousel-img', {
      opacity: (i, t) => (t === current) ? 1 : 0.3,
      duration: 0.4,
      ease: 'power3',
      overwrite: 'auto'
    });
  });

  $('.carousel-img').on('mouseleave', function(e) {
    gsap.to('.carousel-img', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      overwrite: 'auto'
    });
  });

  // ---------- АВТОМАТИЧЕСКОЕ ВРАЩЕНИЕ ----------
  function autoRotate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta >= 16) {
      currentRotation = (currentRotation + ROTATION_SPEED) % 360;
      ring.style.transform = `rotateY(${currentRotation}deg)`;
      lastTime = timestamp;
    }

    animationFrame = requestAnimationFrame(autoRotate);
  }

  // ---------- ОСТАНОВКА ПРИ ПОКИДАНИИ СТРАНИЦЫ ----------
  $(window).on('unload', function() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    } else {
      if (!animationFrame) {
        lastTime = 0;
        animationFrame = requestAnimationFrame(autoRotate);
      }
    }
  });

  console.log('✅ 3D Карусель инициализирована');
  console.log(`📐 Радиус: ${RADIUS}px`);
});