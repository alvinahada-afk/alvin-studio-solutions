import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number };
type Ripple = { x: number; y: number; age: number };

const IDLE_MS = 150;
const SEGMENTS = 20;
const SEGMENT_GAP = 11;
const MAX_SPARKS = 90;
const RIPPLE_MS = 500;

const GOLD_BRIGHT = '#FFE066';
const GOLD_ROYAL = '#D4AF37';
const GOLD_DARK = '#B8860B';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function pointAt(points: Point[], index: number): Point {
  return points[Math.min(index, points.length - 1)] ?? { x: 0, y: 0 };
}

function directionAt(points: Point[], index: number): { x: number; y: number; angle: number } {
  const a = pointAt(points, Math.max(0, index - 1));
  const b = pointAt(points, Math.min(points.length - 1, index + 1));
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(0.001, Math.hypot(dx, dy));
  return { x: dx / length, y: dy / length, angle: Math.atan2(dy, dx) };
}

function drawTaperedBody(ctx: CanvasRenderingContext2D, chain: Point[], time: number) {
  if (chain.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
  ctx.shadowBlur = 15;

  for (let i = chain.length - 1; i >= 1; i -= 1) {
    const p = chain[i];
    const d = directionAt(chain, i);
    const t = i / (chain.length - 1);
    const radius = lerp(7.4, 1.25, t);
    const shimmer = (Math.sin(time * 0.006 + i * 1.8) + 1) * 0.5;

    const gradient = ctx.createLinearGradient(
      p.x - d.y * radius,
      p.y + d.x * radius,
      p.x + d.y * radius,
      p.y - d.x * radius,
    );
    gradient.addColorStop(0, GOLD_DARK);
    gradient.addColorStop(0.32, GOLD_ROYAL);
    gradient.addColorStop(0.55, shimmer > 0.52 ? GOLD_BRIGHT : '#F2CC52');
    gradient.addColorStop(0.78, GOLD_ROYAL);
    gradient.addColorStop(1, GOLD_DARK);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Individual overlapping scale plates.
    const normalX = -d.y;
    const normalY = d.x;
    const scaleRows = radius > 3 ? 2 : 1;
    for (let row = 0; row < scaleRows; row += 1) {
      const offset = (row - (scaleRows - 1) / 2) * radius * 0.48;
      ctx.strokeStyle = 'rgba(255, 224, 102, ' + (0.55 - t * 0.22) + ')';
      ctx.lineWidth = Math.max(0.55, radius * 0.10);
      ctx.beginPath();
      ctx.arc(
        p.x + normalX * offset,
        p.y + normalY * offset,
        radius * 0.58,
        d.angle - 2.35,
        d.angle + 0.15,
      );
      ctx.stroke();
    }

    // Dark belly ridge gives the chain a readable three-dimensional underside.
    ctx.strokeStyle = 'rgba(139, 91, 7, ' + (0.38 - t * 0.18) + ')';
    ctx.lineWidth = Math.max(0.7, radius * 0.16);
    ctx.beginPath();
    ctx.moveTo(p.x - normalX * radius * 0.42, p.y - normalY * radius * 0.42);
    ctx.lineTo(p.x - normalX * radius * 0.42 + d.x * radius * 0.65, p.y - normalY * radius * 0.42 + d.y * radius * 0.65);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawTailMane(ctx: CanvasRenderingContext2D, chain: Point[], time: number) {
  if (chain.length < 5) return;

  const tail = pointAt(chain, chain.length - 1);
  const d = directionAt(chain, chain.length - 1);
  const nx = -d.y;
  const ny = d.x;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.65)';
  ctx.shadowBlur = 12;

  for (let i = 0; i < 8; i += 1) {
    const wave = Math.sin(time * 0.009 + i * 1.3) * (3 + i * 0.7);
    const spread = (i - 3.5) * 2.1;
    const length = 9 + (i % 3) * 5;

    ctx.strokeStyle = i % 2 === 0 ? GOLD_BRIGHT : GOLD_ROYAL;
    ctx.lineWidth = 1.2 + (7 - Math.abs(i - 3.5)) * 0.18;
    ctx.beginPath();
    ctx.moveTo(tail.x + nx * spread, tail.y + ny * spread);
    ctx.quadraticCurveTo(
      tail.x - d.x * length * 0.45 + nx * (spread + wave),
      tail.y - d.y * length * 0.45 + ny * (spread + wave),
      tail.x - d.x * length + nx * (spread * 1.6 + wave * 1.4),
      tail.y - d.y * length + ny * (spread * 1.6 + wave * 1.4),
    );
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawDragonHead(ctx: CanvasRenderingContext2D, head: Point, direction: { x: number; y: number; angle: number }, time: number) {
  const { x: dx, y: dy, angle } = direction;
  const nx = -dy;
  const ny = dx;
  const breathe = Math.sin(time * 0.008) * 0.7;

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(angle);

  ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
  ctx.shadowBlur = 15;

  // Long oriental snout / jaw silhouette.
  const headGradient = ctx.createLinearGradient(-8, -9, 16, 9);
  headGradient.addColorStop(0, GOLD_DARK);
  headGradient.addColorStop(0.38, GOLD_ROYAL);
  headGradient.addColorStop(0.58, GOLD_BRIGHT);
  headGradient.addColorStop(1, '#A66A08');

  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.moveTo(-7, -9);
  ctx.quadraticCurveTo(1, -14, 9, -7);
  ctx.lineTo(18, -3);
  ctx.quadraticCurveTo(22, 0, 17, 4);
  ctx.lineTo(7, 7);
  ctx.quadraticCurveTo(0, 13, -7, 8);
  ctx.lineTo(-12, 3);
  ctx.lineTo(-10, -5);
  ctx.closePath();
  ctx.fill();

  // Brow / cheek plates.
  ctx.strokeStyle = 'rgba(255, 238, 150, .85)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-5, -8);
  ctx.quadraticCurveTo(3, -5, 8, -1);
  ctx.quadraticCurveTo(3, 0, -4, 3);
  ctx.stroke();

  // Eyes.
  ctx.fillStyle = '#FFF4A3';
  ctx.beginPath();
  ctx.ellipse(5, -5.3, 2.5, 1.7, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6B2F00';
  ctx.beginPath();
  ctx.arc(5.7, -5.2, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Open nostril / mouth line.
  ctx.strokeStyle = '#6D3C08';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(13, -2.2);
  ctx.quadraticCurveTo(17, -1, 19, 0);
  ctx.quadraticCurveTo(16, 1.8, 12, 2.2);
  ctx.stroke();

  // Double horns.
  for (const side of [-1, 1]) {
    ctx.fillStyle = side < 0 ? GOLD_DARK : GOLD_ROYAL;
    ctx.beginPath();
    ctx.moveTo(-4, side * 6);
    ctx.quadraticCurveTo(-7, side * 14, -1, side * 18);
    ctx.quadraticCurveTo(0, side * 11, 3, side * 7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = GOLD_BRIGHT;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  // Thin dynamic whiskers / tendrils.
  ctx.lineWidth = 0.75;
  for (let i = 0; i < 3; i += 1) {
    const side = i % 2 === 0 ? 1 : -1;
    const wave = Math.sin(time * 0.012 + i * 1.7) * (2 + i);
    ctx.strokeStyle = 'rgba(255, 224, 102, ' + (0.82 - i * 0.15) + ')';
    ctx.beginPath();
    ctx.moveTo(11, side * (2 + i));
    ctx.bezierCurveTo(
      18 + i * 2, side * (5 + wave),
      25 + i * 3, side * (1 - wave),
      31 + i * 3, side * (7 + wave * 0.6),
    );
    ctx.stroke();
  }

  // Small mane behind the skull.
  for (let i = 0; i < 7; i += 1) {
    const spread = i - 3;
    ctx.strokeStyle = i % 2 ? GOLD_BRIGHT : GOLD_ROYAL;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-6, spread * 2.2);
    ctx.quadraticCurveTo(
      -14 - i * 1.2,
      spread * 4 + breathe,
      -20 - i * 1.5,
      spread * 6 - breathe,
    );
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.restore();

  // Directional highlight behind the head.
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = GOLD_BRIGHT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(head.x - dx * 9 + nx * 3, head.y - dy * 9 + ny * 3);
  ctx.lineTo(head.x - dx * 18 + nx * 6, head.y - dy * 18 + ny * 6);
  ctx.stroke();
  ctx.restore();
}

export function ElectricCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduce) return;

    let frame = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let lastTime = 0;
    let lastMove: Point | null = null;
    let chain: Point[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const clearCanvas = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const stopIfIdle = () => {
      chain = [];
      sparks.length = 0;
      clearCanvas();
      running = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const emitSparks = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const count = clamp(Math.floor(speed * 0.32), 2, 8);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const force = 0.4 + Math.random() * 2.1;
        sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * force - dx * 0.035,
          vy: Math.sin(angle) * force - dy * 0.035,
          life: 0.35 + Math.random() * 0.65,
          size: 0.7 + Math.random() * 1.8,
        });
      }
      while (sparks.length > MAX_SPARKS) sparks.shift();
    };

    const drawSparkles = (delta: number) => {
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.life -= delta / 520;
        s.x += s.vx * (delta / 16);
        s.y += s.vy * (delta / 16);
        s.vx *= 0.985;
        s.vy *= 0.985;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(1, s.life) * 0.9;
        ctx.fillStyle = s.life > 0.45 ? GOLD_BRIGHT : GOLD_ROYAL;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.85)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.55 + s.life), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawRipples = (time: number) => {
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        const age = time - ripple.age;
        const progress = clamp(age / RIPPLE_MS, 0, 1);
        if (progress >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        const radius = 8 + progress * 74;
        const alpha = Math.pow(1 - progress, 1.65);

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 215, 0, ' + alpha * 0.75 + ')';
        ctx.lineWidth = 2.2 - progress * 1.5;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 224, 102, ' + alpha * 0.3 + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(34, time - lastTime) : 16;
      lastTime = time;
      clearCanvas();

      if (chain.length > 1) {
        drawTaperedBody(ctx, chain, time);
        drawTailMane(ctx, chain, time);
        const head = pointAt(chain, 0);
        drawDragonHead(ctx, head, directionAt(chain, 0), time);
      }

      drawSparkles(delta);
      drawRipples(time);
      ctx.shadowBlur = 0;

      if (!chain.length && !sparks.length && !ripples.length) {
        running = false;
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const current = { x: event.clientX, y: event.clientY };
      const previous = lastMove ?? current;
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      lastMove = current;

      if (!chain.length) {
        chain = Array.from({ length: SEGMENTS }, (_, i) => ({
          x: current.x - dx * i * 0.08,
          y: current.y - dy * i * 0.08,
        }));
      } else {
        chain[0] = current;
        for (let i = 1; i < SEGMENTS; i += 1) {
          const lead = chain[i - 1];
          const p = chain[i];
          const vx = lead.x - p.x;
          const vy = lead.y - p.y;
          const distance = Math.max(0.001, Math.hypot(vx, vy));
          const targetX = lead.x - (vx / distance) * SEGMENT_GAP;
          const targetY = lead.y - (vy / distance) * SEGMENT_GAP;
          p.x += (targetX - p.x) * 0.82;
          p.y += (targetY - p.y) * 0.82;
        }
      }

      emitSparks(current.x, current.y, dx, dy);

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(stopIfIdle, IDLE_MS);

      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      ripples.push({ x: event.clientX, y: event.clientY, age: performance.now() });
      if (ripples.length > 5) ripples.shift();
      schedule();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      if (idleTimer) clearTimeout(idleTimer);
      if (frame) cancelAnimationFrame(frame);
      clearCanvas();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
      aria-hidden="true"
    />
  );
}
