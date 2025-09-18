"use client";

import React, { useRef, useEffect } from "react";

// Mappa 2D: 1 = quadretto, 0 = vuoto (più fedele all'immagine, più densa in basso, più vuota in alto)
const PIXEL_MAP = [
  // Riga 0 (in alto)
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1],
  [1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const GRID_COLS = 40;
const GRID_ROWS = 12;
const PIXEL_COLOR = "#3B82F6"; // Tailwind blue-400
const CANVAS_HEIGHT = 260;
const ANIMATED_ROWS = 5; // Solo le prime 5 righe dall'alto animate

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = CANVAS_HEIGHT;
    };
    resize();
    window.addEventListener("resize", resize);

    // Animazione ondulatoria
    let running = true;
    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixelSize = Math.min(canvas.width / GRID_COLS, canvas.height / GRID_ROWS);
      // Niente offsetX: la griglia parte da sinistra
      const offsetY = (canvas.height - pixelSize * GRID_ROWS) / 2;
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          if (PIXEL_MAP[row][col]) {
            // Solo le prime ANIMATED_ROWS righe animate
            const isAnimated = row < ANIMATED_ROWS;
            const wave = isAnimated ? Math.sin(t / 500 + col * 0.5) * 16 : 0;
            ctx.fillStyle = PIXEL_COLOR;
            ctx.fillRect(
              col * pixelSize,
              offsetY + row * pixelSize + wave,
              pixelSize,
              pixelSize
            );
          }
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-white overflow-hidden">
      {/* Canvas overlay blocchi blu animati */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed left-0 bottom-0 w-screen h-[260px] z-20"
        style={{ display: 'block' }}
      />
      {/* Overlay per rendere il contenuto leggibile sopra il canvas */}
      <div className="relative z-30">
        {/* Header */}
        <header className="flex justify-between items-start px-6 pt-6">
          {/* Logo Placeholder */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-400" />
              <span className="font-bold text-lg tracking-tight ml-1">Essilor<span className="font-normal">Luxottica</span></span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-light text-lg">CreativeHub</div>
            <div className="mt-8 text-base">
              Sign up <a href="#" className="text-blue-500 underline">here</a>
            </div>
          </div>
        </header>

        {/* Main Title */}
        <div className="flex flex-col items-center mt-12">
          <div className="text-5xl md:text-7xl font-mono font-bold tracking-widest text-black text-center leading-tight">
            <div>CTRL<span className="text-2xl align-super">+</span></div>
            <div>ALT<span className="text-2xl align-super">+</span></div>
            <div>
              <span className="text-blue-500">RE</span>THINK
              <span className="inline-block w-5 h-5 bg-blue-400 ml-1 align-middle" style={{verticalAlign: 'middle'}} />
            </div>
          </div>
          <div className="mt-6 text-2xl md:text-3xl font-light text-black text-center">
            The CreativeHub <span className="text-blue-500">Hackathon</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col items-center">
          <p className="max-w-xl text-center text-lg text-black font-normal hero-text-mobile">
            Prepare for a reality shift.<br />
            You&apos;re invited to a gathering of bold minds to rethink and reshape the future of eyewear. Expect disruption. Embrace the unexpected. Get ready to build something the world hasn&apos;t seen before.
          </p>
        </div>

        {/* Event Details */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-blue-500 text-lg font-medium">Date TBD - from Xpm</div>
          <div className="text-black text-lg">Location TBD</div>
          <div className="text-black text-lg">Milano</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;