import { useEffect, useRef } from "react";
import { createFire, FIRE_PALETTE, spreadFire } from "./fire.js";

const PIXEL_SIZE = 4;
const FRAME_INTERVAL_MS = 40;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    let width = 1;
    let height = 1;
    let fire = createFire(width, height);
    let image = context.createImageData(width, height);
    let frame = 0;
    let lastFrame = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width / PIXEL_SIZE));
      height = Math.max(1, Math.floor(bounds.height / PIXEL_SIZE));
      canvas.width = width;
      canvas.height = height;
      fire = createFire(width, height);
      image = context.createImageData(width, height);
      context.imageSmoothingEnabled = false;
    };

    const draw = (timestamp: number) => {
      frame = window.requestAnimationFrame(draw);
      if (timestamp - lastFrame < FRAME_INTERVAL_MS) return;
      lastFrame = timestamp;

      spreadFire(fire, width, height);
      for (let i = 0; i < fire.length; i += 1) {
        const [red, green, blue] = FIRE_PALETTE[fire[i]];
        const pixel = i * 4;
        image.data[pixel] = red;
        image.data[pixel + 1] = green;
        image.data[pixel + 2] = blue;
        image.data[pixel + 3] = 255;
      }
      context.putImageData(image, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="fire-screen" aria-label="Endless Doom-style fire animation">
      <canvas ref={canvasRef} className="fire-canvas" aria-hidden="true" />
    </main>
  );
}

export default App;
