import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type ElectricBurst = { x: number; y: number; alpha: number; age: number; seed: number };

const IDLE_MS = 150;
const MAX_TRAIL_POINTS = 30;
const MAX_ELECTRIC_BURSTS = 3;

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
    let running = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastTime = 0;
    let trail: Point[] = [];
    const electricBursts: ElectricBurst[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const clearAndStop = () => {
      trail = [];
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      running = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const drawLightning = (time: number, strand: 0 | 1) => {
      if (trail.length < 2) return;

      const phase = time * 0.018 + strand * 2.7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < trail.length; i += 1) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = i / (trail.length - 1);
        const alpha = Math.pow(age, 1.55) * 0.95;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / distance;
        const ny = dx / distance;
        const offset = strand === 0 ? -2.2 : 2.2;
        const startX = a.x + nx * offset;
        const startY = a.y + ny * offset;
        const endX = b.x + nx * offset;
        const endY = b.y + ny * offset;
        const segments = Math.max(2, Math.min(5, Math.ceil(distance / 16)));

        ctx.strokeStyle = 'rgba(0, 242, 254, ' + alpha * 0.98 + ')';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = strand === 0 ? 24 : 18;
        ctx.lineWidth = strand === 0 ? 1.9 : 1.45;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        for (let s = 1; s <= segments; s += 1) {
          const t = s / segments;
          const flicker =
            Math.sin(phase + i * 1.91 + s * 2.37) * 2.8 +
            Math.sin(phase * 0.61 + i * 3.17 + s) * 1.2;
          const px = startX + (endX - startX) * t + nx * flicker;
          const py = startY + (endY - startY) * t + ny * flicker;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(32, time - lastTime) : 16;
      lastTime = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      drawLightning(time, 0);
      drawLightning(time, 1);

      for (let i = electricBursts.length - 1; i >= 0; i -= 1) {
        const burst = electricBursts[i];
        burst.age += delta;
        burst.alpha -= delta * 0.0042;

        if (burst.alpha <= 0) {
          electricBursts.splice(i, 1);
          continue;
        }

        const progress = Math.min(burst.age / 260, 1);
        const length = 18 + progress * 42;
        const rays = 7;

        ctx.save();
        ctx.translate(burst.x, burst.y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 18;

        for (let r = 0; r < rays; r += 1) {
          const angle =
            (r / rays) * Math.PI * 2 +
            Math.sin(burst.seed + r * 2.4) * 0.16;
          const jitter = Math.sin(time * 0.035 + burst.seed + r * 3.1) * 5;
          const inner = 3 + progress * 5;
          const outer = inner + length + jitter;

          ctx.strokeStyle =
            'rgba(0, 242, 254, ' + burst.alpha * (0.72 - r * 0.035) + ')';
          ctx.lineWidth = r % 2 === 0 ? 1.7 : 1.05;

          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);

          const mid = inner + (outer - inner) * 0.48;
          const bend = (r % 2 === 0 ? 1 : -1) * 3.5;
          ctx.lineTo(
            Math.cos(angle) * mid + Math.cos(angle + Math.PI / 2) * bend,
            Math.sin(angle) * mid + Math.sin(angle + Math.PI / 2) * bend
          );
          ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          ctx.stroke();
        }

        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(255, 255, 255, ' + burst.alpha * 0.95 + ')';
        ctx.beginPath();
        ctx.arc(0, 0, 1.7 + burst.alpha * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.shadowBlur = 0;

      if (trail.length === 0 && electricBursts.length === 0) {
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

      trail.push({ x: event.clientX, y: event.clientY });
      if (trail.length > MAX_TRAIL_POINTS) trail.shift();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        trail = [];
        if (electricBursts.length === 0) clearAndStop();
      }, IDLE_MS);

      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      electricBursts.push({
        x: event.clientX,
        y: event.clientY,
        alpha: 1,
        age: 0,
        seed: Math.random() * Math.PI * 2,
      });

      if (electricBursts.length > MAX_ELECTRIC_BURSTS) electricBursts.shift();
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
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen"
      aria-hidden="true"
    />
  );
}
