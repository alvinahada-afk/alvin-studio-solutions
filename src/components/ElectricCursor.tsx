import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type MagneticGlow = { x: number; y: number; radius: number; alpha: number; angle: number };

const IDLE_MS = 150;
const MAX_TRAIL_POINTS = 30;
const MAX_MAGNETIC_GLOWS = 3;

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
    const magneticGlows: MagneticGlow[] = [];

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

      for (let i = magneticGlows.length - 1; i >= 0; i -= 1) {
        const glow = magneticGlows[i];
        glow.radius += delta * 0.12;
        glow.alpha -= delta * 0.0038;
        glow.angle += delta * 0.0025;

        if (glow.alpha <= 0) {
          magneticGlows.splice(i, 1);
          continue;
        }

        const pulse = 1 + Math.sin(time * 0.025 + i) * 0.08;
        const outerRadius = glow.radius * pulse;

        const gradient = ctx.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          outerRadius
        );
        gradient.addColorStop(0, 'rgba(0, 242, 254, ' + glow.alpha * 0.22 + ')');
        gradient.addColorStop(0.28, 'rgba(0, 242, 254, ' + glow.alpha * 0.10 + ')');
        gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, outerRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 22;
        ctx.fillStyle = 'rgba(255, 255, 255, ' + glow.alpha * 0.9 + ')';
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, 1.8 + glow.alpha * 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(glow.x, glow.y);
        ctx.rotate(glow.angle);
        ctx.strokeStyle = 'rgba(0, 242, 254, ' + glow.alpha * 0.62 + ')';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-outerRadius * 0.32, 0);
        ctx.lineTo(outerRadius * 0.32, 0);
        ctx.moveTo(0, -outerRadius * 0.32);
        ctx.lineTo(0, outerRadius * 0.32);
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowBlur = 0;

      if (trail.length === 0 && magneticGlows.length === 0) {
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
        if (magneticGlows.length === 0) clearAndStop();
      }, IDLE_MS);

      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      magneticGlows.push({
        x: event.clientX,
        y: event.clientY,
        radius: 7,
        alpha: 1,
        angle: Math.random() * Math.PI,
      });

      if (magneticGlows.length > MAX_MAGNETIC_GLOWS) magneticGlows.shift();
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
