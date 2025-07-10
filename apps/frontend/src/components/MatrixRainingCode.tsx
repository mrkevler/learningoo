import { useEffect, useRef } from "react";

const MatrixRainingCode = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let columns = Math.floor(width / 20);
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charArray = characters.split("");
    let drops: number[] = new Array(columns).fill(1);

    const frameRate = 25;
    let lastFrameTime = Date.now();

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#0f0";
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > 1000 / frameRate) {
        draw();
        lastFrameTime = currentTime;
      }
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 20);
      drops = new Array(columns).fill(1);
    };

    if (!/Mobi/i.test(window.navigator.userAgent)) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (!/Mobi/i.test(window.navigator.userAgent)) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas fixed top-0 left-0 w-full h-full z-[-1] opacity-30"
    />
  );
};

export default MatrixRainingCode;
