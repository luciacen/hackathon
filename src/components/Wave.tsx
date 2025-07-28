'use client';

import React, { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  size: number;
  speed: number;
  landed: boolean;
}

const Wave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Imposta le dimensioni del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Carica l'immagine SVG pixels
    const pixelsImage = new Image();
    pixelsImage.src = '/assets/pixels.svg';

    const pixels: Pixel[] = [];
    const pixelSize = 10; // Aumentato da 4 a 8 (doppio)
    const color = '#4d68f1';

    // Funzione per creare nuovi pixel
    const createPixel = () => {
      const x = Math.random() * canvas.width;
      const size = Math.random() > 0.7 ? pixelSize * 2 : pixelSize; // 30% chance di pixel più grandi (20px)
      const speed = 1 + Math.random() * 2;
      
      pixels.push({
        x,
        y: -size,
        size,
        speed,
        landed: false
      });
    };

    // Funzione per trovare l'altezza massima dei pixel atterrati in una colonna
    const getMaxHeightAtX = (x: number) => {
      let maxHeight = 0;
      pixels.forEach(pixel => {
        if (pixel.landed && 
            pixel.x >= x - pixelSize && 
            pixel.x <= x + pixelSize) {
          const pixelBottom = pixel.y + pixel.size;
          if (pixelBottom > maxHeight) {
            maxHeight = pixelBottom;
          }
        }
      });
      return maxHeight;
    };

    // Funzione per aggiornare e disegnare i pixel
    const animate = () => {
      // Pulisci il canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Disegna l'immagine SVG pixels come background
      if (pixelsImage.complete) {
        // Calcola le dimensioni per mantenere le proporzioni
        const imageAspectRatio = pixelsImage.width / pixelsImage.height;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imageAspectRatio > canvasAspectRatio) {
          // L'immagine è più larga, adatta alla larghezza
          drawWidth = canvas.width;
          drawHeight = canvas.width / imageAspectRatio;
          drawX = 0;
          drawY = canvas.height - drawHeight + 50; // Posiziona più in basso (+50px)
        } else {
          // L'immagine è più alta, adatta all'altezza
          drawHeight = canvas.height;
          drawWidth = canvas.height * imageAspectRatio;
          drawX = (canvas.width - drawWidth) / 2; // Centra orizzontalmente
          drawY = 50; // Posiziona più in basso (+50px)
        }
        
        ctx.drawImage(pixelsImage, drawX, drawY, drawWidth, drawHeight);
      }

      // Crea nuovi pixel casualmente - aumentata leggermente la frequenza
      if (Math.random() < 0.03) { // Aumentato da 0.03 a 0.05 (5% di probabilità ogni frame)
        createPixel();
      }

      // Aggiorna e disegna i pixel
      pixels.forEach((pixel, index) => {
        if (!pixel.landed) {
          pixel.y += pixel.speed;
          
          // Trova l'altezza massima dei pixel già atterrati in quella zona
          const maxHeight = getMaxHeightAtX(pixel.x);
          const landingY = Math.max(canvas.height - pixel.size, maxHeight);
          
          // Controlla se il pixel è atterrato
          if (pixel.y >= landingY) {
            pixel.landed = true;
            pixel.y = landingY;
          }
        }

        // Disegna il pixel
        ctx.fillStyle = color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      // Rimuovi pixel vecchi solo se ce ne sono troppi - aumentato il limite
      if (pixels.length > 1300) { // Aumentato da 200 a 300
        pixels.splice(0, 30); // Ridotto da 50 a 30 per rimuovere meno pixel
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default Wave; 