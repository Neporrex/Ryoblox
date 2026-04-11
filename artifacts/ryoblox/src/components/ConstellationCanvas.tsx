import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 0.9 + 0.3,
        alpha: Math.random() * 0.35 + 0.1,
      }));
    };

    const MOUSE_RADIUS = 120;
    const LINE_DIST = 100;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const stars = starsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        const dx = mx - star.x;
        const dy = my - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          star.x -= dx * force * 0.035;
          star.y -= dy * force * 0.035;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINE_DIST) {
            const mdx = mx - stars[i].x;
            const mdy = my - stars[i].y;
            const md = Math.sqrt(mdx * mdx + mdy * mdy);
            const proximity = Math.max(0, 1 - md / MOUSE_RADIUS);
            const baseAlpha = (1 - d / LINE_DIST) * 0.1;
            const lineAlpha = baseAlpha + proximity * 0.4;

            if (lineAlpha < 0.01) continue;

            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);

            if (proximity > 0.05) {
              ctx.strokeStyle = `rgba(220,38,38,${lineAlpha})`;
              ctx.lineWidth = 0.6 + proximity * 0.6;
            } else {
              ctx.strokeStyle = `rgba(255,255,255,${baseAlpha})`;
              ctx.lineWidth = 0.4;
            }
            ctx.stroke();
          }
        }
      }

      void time;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    resize();
    initStars();
    animFrameRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); initStars(); });
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="constellation-canvas" />;
}
