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

function drawDragonBody(ctx: CanvasRenderingContext2D, chain: Point[], time: number) {
  if (chain.length < 3) return;

  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i < chain.length; i += 1) {
    const p = chain[i];
    const prev = chain[Math.max(0, i - 1)];
    const next = chain[Math.min(chain.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.max(0.001, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / (chain.length - 1);
    const width = 18 * Math.pow(1 - t, 0.72) + 1.5;

    left.push({ x: p.x + nx * width, y: p.y + ny * width });
    right.push({ x: p.x - nx * width, y: p.y - ny * width });
  }

  const head = chain[0];
  const tail = chain[chain.length - 1];
  const bodyGradient = ctx.createLinearGradient(
    head.x, head.y - 24,
    tail.x, tail.y + 24,
  );
  bodyGradient.addColorStop(0, '#FFE066');
  bodyGradient.addColorStop(0.18, '#D4AF37');
  bodyGradient.addColorStop(0.48, '#FFE066');
  bodyGradient.addColorStop(0.72, '#D4AF37');
  bodyGradient.addColorStop(1, '#B8860B');

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
  ctx.shadowBlur = 15;

  // One continuous closed Bézier ribbon — no circular body segments.
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < left.length; i += 1) {
    const a = left[i - 1];
    const b = left[i];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5;
    ctx.quadraticCurveTo(a.x, a.y, mx, my);
  }
  const lastLeft = left[left.length - 1];
  ctx.lineTo(lastLeft.x, lastLeft.y);
  for (let i = right.length - 2; i >= 0; i -= 1) {
    const a = right[i + 1];
    const b = right[i];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5;
    ctx.quadraticCurveTo(a.x, a.y, mx, my);
  }
  ctx.lineTo(right[0].x, right[0].y);
  ctx.closePath();
  ctx.fill();

  // Raised dorsal ridge follows the same continuous spine.
  const ridgeGradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  ridgeGradient.addColorStop(0, 'rgba(255,244,163,.95)');
  ridgeGradient.addColorStop(0.4, 'rgba(255,224,102,.65)');
  ridgeGradient.addColorStop(1, 'rgba(184,134,11,.18)');
  ctx.strokeStyle = ridgeGradient;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(chain[0].x, chain[0].y - 1);
  for (let i = 1; i < chain.length; i += 1) {
    const p = chain[i];
    const prev = chain[Math.max(0, i - 1)];
    const next = chain[Math.min(chain.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.max(.001, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / (chain.length - 1);
    const offset = 4.5 * (1 - t);
    ctx.lineTo(p.x + nx * offset, p.y + ny * offset);
  }
  ctx.stroke();

  // Scale chevrons are laid onto the ribbon, not separate circles.
  ctx.lineWidth = 0.9;
  for (let i = 1; i < chain.length - 2; i += 1) {
    const p = chain[i];
    const prev = chain[i - 1];
    const next = chain[i + 1];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.max(.001, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / (chain.length - 1);
    const width = 12 * Math.pow(1 - t, .75) + 1.2;
    ctx.strokeStyle = 'rgba(112,69,4,' + (0.38 - t * 0.18) + ')';
    ctx.beginPath();
    ctx.moveTo(p.x + nx * width * .62 - dx / len * width * .24, p.y + ny * width * .62 - dy / len * width * .24);
    ctx.quadraticCurveTo(p.x, p.y + width * .05, p.x - nx * width * .62 - dx / len * width * .24, p.y - ny * width * .62 - dy / len * width * .24);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDragonHead(ctx: CanvasRenderingContext2D, head: Point, direction: { x: number; y: number; angle: number }, time: number) {
  const { angle } = direction;
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(angle);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.75)';
  ctx.shadowBlur = 15;

  const gold = ctx.createLinearGradient(-14, -22, 25, 18);
  gold.addColorStop(0, '#B8860B');
  gold.addColorStop(.28, '#D4AF37');
  gold.addColorStop(.55, '#FFE066');
  gold.addColorStop(.78, '#D4AF37');
  gold.addColorStop(1, '#8A5A08');

  // Oriental dragon skull silhouette: crown, cheek, long snout and jaw.
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(-15, -12);
  ctx.lineTo(-7, -19);
  ctx.lineTo(-2, -13);
  ctx.lineTo(4, -21);
  ctx.lineTo(8, -11);
  ctx.quadraticCurveTo(17, -9, 23, -3);
  ctx.lineTo(29, 1);
  ctx.lineTo(22, 5);
  ctx.lineTo(13, 7);
  ctx.quadraticCurveTo(8, 15, 0, 13);
  ctx.lineTo(-5, 7);
  ctx.lineTo(-15, 9);
  ctx.lineTo(-11, 1);
  ctx.closePath();
  ctx.fill();

  // Crown horns: tall, hooked, visibly separated.
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.moveTo(-8, -10);
  ctx.quadraticCurveTo(-17, -22, -11, -30);
  ctx.quadraticCurveTo(-7, -23, -2, -13);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(1, -10);
  ctx.quadraticCurveTo(5, -24, 14, -29);
  ctx.quadraticCurveTo(12, -17, 7, -8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#FFE066';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Brow plates and eye.
  ctx.strokeStyle = 'rgba(255,244,163,.95)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, -9);
  ctx.quadraticCurveTo(5, -13, 11, -8);
  ctx.lineTo(7, -4);
  ctx.stroke();

  ctx.fillStyle = '#FFF4A3';
  ctx.beginPath();
  ctx.moveTo(4, -7);
  ctx.quadraticCurveTo(8, -9, 11, -6);
  ctx.quadraticCurveTo(8, -3, 4, -5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4A2100';
  ctx.beginPath();
  ctx.moveTo(8, -7);
  ctx.lineTo(9.5, -5.5);
  ctx.lineTo(8, -4);
  ctx.closePath();
  ctx.fill();

  // Snout, nostril and jaw separation.
  ctx.strokeStyle = '#6A3B08';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(15, -3);
  ctx.quadraticCurveTo(22, -1, 27, 1);
  ctx.quadraticCurveTo(22, 2, 16, 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, -1);
  ctx.lineTo(22, -2);
  ctx.stroke();

  // Beard / whisker roots.
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 3; i += 1) {
      const wave = Math.sin(time * .011 + i * 1.7 + side) * (2 + i);
      ctx.strokeStyle = i === 0 ? '#FFE066' : '#D4AF37';
      ctx.lineWidth = .75 + (2 - i) * .18;
      ctx.beginPath();
      ctx.moveTo(17, side * (2 + i * 1.5));
      ctx.bezierCurveTo(
        25, side * (5 + wave),
        33 + i * 3, side * (-1 - wave),
        42 + i * 4, side * (6 + wave * .5),
      );
      ctx.stroke();
    }
  }

  // Flowing mane behind the skull.
  for (let i = 0; i < 9; i += 1) {
    const y = -14 + i * 3.5;
    const wave = Math.sin(time * .008 + i) * 3;
    ctx.strokeStyle = i % 2 ? '#D4AF37' : '#FFE066';
    ctx.lineWidth = 1.4 - Math.abs(i - 4) * .08;
    ctx.beginPath();
    ctx.moveTo(-9, y);
    ctx.bezierCurveTo(-19, y + wave, -27, y * .7 - wave, -34, y * .95);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawTailFan(ctx: CanvasRenderingContext2D, chain: Point[], time: number) {
  if (chain.length < 4) return;
  const tail = chain[chain.length - 1];
  const prev = chain[chain.length - 2];
  const dx = tail.x - prev.x;
  const dy = tail.y - prev.y;
  const len = Math.max(.001, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.translate(tail.x, tail.y);
  ctx.rotate(angle);
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255,215,0,.7)';
  ctx.shadowBlur = 12;

  for (let i = -4; i <= 4; i += 1) {
    const wave = Math.sin(time * .009 + i) * 2.5;
    ctx.strokeStyle = Math.abs(i) < 2 ? '#FFE066' : '#D4AF37';
    ctx.lineWidth = 1.2 + (4 - Math.abs(i)) * .16;
    ctx.beginPath();
    ctx.moveTo(2, i * 1.2);
    ctx.quadraticCurveTo(12, i * 3 + wave, 23, i * 5.5 + wave);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
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
