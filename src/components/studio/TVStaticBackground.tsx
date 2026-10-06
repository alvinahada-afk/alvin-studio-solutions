import { useEffect, useRef } from "react";

const FPS = 30;
const WIDTH = 180;
const HEIGHT = 100;
const OPACITY = 0.07;

export function TVStaticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const image = ctx.createImageData(WIDTH, HEIGHT);
    const data = image.data;
    let raf = 0;
    let last = 0;
    let running = true;

    const render = (time: number) => {
      if (!running) return;
      if (time - last < 1000 / FPS) {
        raf = requestAnimationFrame(render);
        return;
      }
      last = time;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        const soft = 42 + v * 0.72;
        data[i] = soft;
        data[i + 1] = soft;
        data[i + 2] = soft;
        data[i + 3] = 255;
      }

      ctx.putImageData(image, 0, 0);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="tv-static-background pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: OPACITY }}
    />
  );
}
