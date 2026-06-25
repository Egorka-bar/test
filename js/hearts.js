document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const HEART_COUNT = 25; // было 35 – уменьшили количество
  const hearts = [];
  const colors = [
    'rgba(125,40,38,0.35)', // было 0.55 – уменьшили прозрачность
    'rgba(160,40,60,0.30)',
    'rgba(255,255,255,0.40)',
    'rgba(201,168,76,0.25)'
  ];

  class Heart {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height * -1 : -20;
      this.size = 10 + Math.random() * 12; // было 12+14 – чуть меньше
      this.speedY = 0.4 + Math.random() * 0.8; // было 0.6+1.2 – медленнее
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.015 + Math.random() * 0.015;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, this.size * 0.2);
      ctx.bezierCurveTo(-this.size * 0.6, -this.size * 0.5, -this.size * 0.6, -this.size * 0.9, 0, -this.size * 0.6);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.9, this.size * 0.6, -this.size * 0.5, 0, this.size * 0.2);
      ctx.stroke();
      ctx.restore();
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.4;
      this.y += this.speedY;
      this.rot += this.rotSpeed;
      if (this.y > canvas.height + 20) this.reset(false);
    }
  }

  for (let i = 0; i < HEART_COUNT; i++) {
    hearts.push(new Heart());
  }

  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(function(h) {
      h.update();
      h.draw();
    });
    requestAnimationFrame(animateHearts);
  }
  animateHearts();
});