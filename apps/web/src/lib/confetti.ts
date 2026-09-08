/**
 * TOEIC Master — Lightweight Confetti Animation Engine
 * Creates beautiful, celebratory confetti bursts using native HTML5 Canvas.
 * Colors tailored to the brand palette (Rose, Indigo, Soft Teal, Warm Amber).
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  size: number;
  color: string;
  shape: 'square' | 'circle';
  alpha: number;
  decay: number;
}

export function fireConfetti(options?: {
  particleCount?: number;
  origin?: { x: number; y: number };
  durationMs?: number;
}) {
  if (typeof window === 'undefined') return;

  const count = options?.particleCount ?? 60;
  const originX = options?.origin?.x ?? window.innerWidth / 2;
  const originY = options?.origin?.y ?? window.innerHeight / 2;
  const duration = options?.durationMs ?? 3000;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  // Curated harmonious colors matching our brand
  const colors = [
    '#FB7185', // Rose 400
    '#818CF8', // Indigo 400
    '#2DD4BF', // Soft Teal
    '#FBBF24', // Warm Amber
    '#C084FC', // Violet
    '#38BDF8', // Sky Blue
  ];

  const particles: ConfettiParticle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    const chosenColor = colors[Math.floor(Math.random() * colors.length)] ?? '#FB7185';
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      angle: Math.random() * 360,
      angularVelocity: (Math.random() - 0.5) * 12,
      size: 6 + Math.random() * 6,
      color: chosenColor,
      shape: Math.random() > 0.4 ? 'square' : 'circle',
      alpha: 1,
      decay: 0.008 + Math.random() * 0.012,
    });
  }

  const startTime = Date.now();
  let animId: number;

  function loop() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration || particles.length === 0) {
      cancelAnimationFrame(animId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // air resistance
      p.angle += p.angularVelocity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(loop);
  }

  animId = requestAnimationFrame(loop);
}
