import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Fracture = { points: Point[]; width: number; delay: number };
type Burst = { x: number; y: number; born: number; fractures: Fracture[] };

const DURATION = 720;
const MAX_BURSTS = 6;
const PIGEON = "rgba(143,163,184,0.92)";
const ICE = "rgba(255,255,255,0.85)";

const random = (min: number, max: number) => min + Math.random() * (max - min);

function makeFracture(x: number, y: number, angle: number, length: number): Fracture {
  const steps = 3 + Math.floor(Math.random() * 3);
  const points: Point[] = [{ x, y }];

  for (let i = 1; i <= steps; i++) {
    const distance = (length / steps) * i;
    const bend = i === steps ? 0 : random(-7, 7);
    const a = angle + (bend * Math.PI) / 180;
    points.push({ x: x + Math.cos(a) * distance, y: y + Math.sin(a) * distance });
  }

  return { points, width: random(0.65, 1.25), delay: random(0, 45) };
}

function addMinorFractures(fractures: Fracture[]) {
  [...fractures].forEach((main) => {
    if (main.points.length < 3) return;
    const branches = Math.random() > 0.25 ? 2 : 1;

    for (let i = 0; i < branches; i++) {
      const index = 1 + Math.floor(Math.random() * (main.points.length - 1));
      const origin = main.points[index];
      const previous = main.points[index - 1];
      const base = Math.atan2(origin.y - previous.y, origin.x - previous.x);
      const angle = base + (Math.random() > 0.5 ? 1 : -1) * random(0.55, 1.15);
      fractures.push(makeFracture(origin.x, origin.y, angle, random(10, 22)));
    }
  });
}

export function ScreenCrackEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstsRef = useRef<Burst[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: window.innerWidth, height: window.innerHeight, dpr };
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFracture = (fracture: Fracture, opacity: number) => {
      if (fracture.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(fracture.points[0].x, fracture.points[0].y);
      for (let i = 1; i < fracture.points.length; i++) {
        ctx.lineTo(fracture.points[i].x, fracture.points[i].y);
      }
      ctx.strokeStyle = ICE;
      ctx.globalAlpha = opacity * 0.72;
      ctx.lineWidth = fracture.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(fracture.points[0].x, fracture.points[0].y);
      ctx.lineTo(fracture.points[1].x, fracture.points[1].y);
      ctx.strokeStyle = PIGEON;
      ctx.globalAlpha = opacity * 0.48;
      ctx.lineWidth = Math.max(0.5, fracture.width * 0.65);
      ctx.stroke();
    };

    const render = (now: number) => {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const active: Burst[] = [];
      for (const burst of burstsRef.current) {
        const age = now - burst.born;
        if (age >= DURATION) continue;

        const progress = Math.min(1, age / DURATION);
        const fade = 1 - progress;
        const ease = 1 - Math.pow(1 - progress, 3);

        for (const fracture of burst.fractures) {
          const local = Math.max(0, Math.min(1, (progress - fracture.delay / DURATION) * 3.2));
          const alpha = local * fade;
          if (alpha <= 0) continue;
          ctx.globalCompositeOperation = "screen";
          drawFracture(fracture, alpha);
        }

        const radius = 3 + ease * 55;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = PIGEON;
        ctx.globalAlpha = 0.42 * fade;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(burst.x, burst.y, Math.max(1, radius * 0.36), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.72)";
        ctx.globalAlpha = 0.26 * fade;
        ctx.lineWidth = 0.55;
        ctx.stroke();

        active.push(burst);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      burstsRef.current = active;

      if (active.length) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        rafRef.current = null;
      }
    };

    const spawn = (x: number, y: number) => {
      const fractures: Fracture[] = [];
      const count = 5 + Math.floor(Math.random() * 4);
      const start = random(0, Math.PI * 2);

      for (let i = 0; i < count; i++) {
        const angle = start + (Math.PI * 2 * i) / count + random(-0.22, 0.22);
        fractures.push(makeFracture(x, y, angle, random(40, 60)));
      }

      addMinorFractures(fractures);
      burstsRef.current.push({ x, y, born: performance.now(), fractures });

      if (burstsRef.current.length > MAX_BURSTS) {
        burstsRef.current.splice(0, burstsRef.current.length - MAX_BURSTS);
      }

      if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      spawn(event.clientX, event.clientY);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      burstsRef.current = [];
      ctx.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  );
}
