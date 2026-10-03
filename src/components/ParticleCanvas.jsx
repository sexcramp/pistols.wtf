import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ effect = 'stars', primaryColor = '#EE6F35' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (effect === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = effect === 'stars' ? 80 : 60;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: effect === 'rain' ? Math.random() * 3 + 2 : (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        pulsing: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Update
        p.x += p.speedX;
        p.y += p.speedY;

        if (effect === 'stars') {
          p.opacity += p.pulsing;
          if (p.opacity > 0.85 || p.opacity < 0.15) {
            p.pulsing = -p.pulsing;
          }
        }

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        if (effect === 'rain') {
          ctx.strokeStyle = `rgba(238, 111, 53, ${p.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 12);
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          // Random slight orange tint for 30% of stars
          ctx.fillStyle = p.radius > 1.3 
            ? `rgba(238, 111, 53, ${p.opacity})` 
            : `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect, primaryColor]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
