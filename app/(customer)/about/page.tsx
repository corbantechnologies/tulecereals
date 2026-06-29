"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AboutPage() {
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const heroCanvas = heroCanvasRef.current;
    const circleCanvas = circleCanvasRef.current;
    if (!heroCanvas || !circleCanvas) return;

    const heroCtx = heroCanvas.getContext("2d");
    const circleCtx = circleCanvas.getContext("2d");
    if (!heroCtx || !circleCtx) return;

    let animationFrameId: number;

    // Track dimension boundaries independently
    let heroW = (heroCanvas.width = heroCanvas.parentElement?.clientWidth || window.innerWidth);
    let heroH = (heroCanvas.height = heroCanvas.parentElement?.clientHeight || 400);
    
    let circleW = (circleCanvas.width = circleCanvas.parentElement?.clientWidth || 400);
    let circleH = (circleCanvas.height = circleCanvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (heroCanvas && circleCanvas) {
        heroW = heroCanvas.width = heroCanvas.parentElement?.clientWidth || window.innerWidth;
        heroH = heroCanvas.height = heroCanvas.parentElement?.clientHeight || 400;
        circleW = circleCanvas.width = circleCanvas.parentElement?.clientWidth || 400;
        circleH = circleCanvas.height = circleCanvas.parentElement?.clientHeight || 400;
      }
    };
    window.addEventListener("resize", handleResize);

    // Dynamic setups for both systems
    const createBlobs = (w: number, h: number) => [
      { x: w * 0.3, y: h * 0.4, radius: w * 0.4, vx: 0.2, vy: 0.15, color: "rgba(141, 110, 99, 0.05)" },
      { x: w * 0.7, y: h * 0.6, radius: w * 0.5, vx: -0.15, vy: 0.2, color: "rgba(212, 163, 115, 0.04)" }
    ];

    const createParticles = (w: number, h: number, count: number) => {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.8 + 1,
          speedY: -(Math.random() * 0.3 + 0.1),
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.01 - 0.005,
        });
      }
      return arr;
    };

    const heroBlobs = createBlobs(heroW, heroH);
    const heroParticles = createParticles(heroW, heroH, 25);

    const circleBlobs = createBlobs(circleW, circleH);
    const circleParticles = createParticles(circleW, circleH, 12);

    // Helper to draw simulation loops onto specified contexts
    const updateAndDrawSystem = (ctx: CanvasRenderingContext2D, w: number, h: number, blobs: any[], particles: any[]) => {
      ctx.clearRect(0, 0, w, h);

      // Blobs
      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x - blob.radius < -20 || blob.x + blob.radius > w + 20) blob.vx *= -1;
        if (blob.y - blob.radius < -20 || blob.y + blob.radius > h + 20) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 5, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating Grain Particles
      ctx.fillStyle = "rgba(141, 110, 99, 0.15)";
      particles.forEach((p) => {
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const render = () => {
      updateAndDrawSystem(heroCtx, heroW, heroH, heroBlobs, heroParticles);
      updateAndDrawSystem(circleCtx, circleW, circleH, circleBlobs, circleParticles);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Dynamic Keyframe Injection for wind sway & organic sea wave morphing */}
      <style jsx global>{`
        @keyframes liquidWave {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          50% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
          100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
        }
        @keyframes swayMotion {
          0% { transform: translateY(0px) rotate(0deg) scale(0.95); }
          50% { transform: translateY(-12px) rotate(1.5deg) scale(0.97); }
          100% { transform: translateY(0px) rotate(0deg) scale(0.95); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-secondary/30 overflow-hidden">
        {/* Abstract Background Layer */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl" />
        </div>

        {/* HTML5 Canvas Ambient Motion Layer */}
        <canvas
          ref={heroCanvasRef}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4 select-none">
            Our Story
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Cultivating goodness from the earth to your bowl.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="order-2 md:order-1 flex justify-center">
              {/* Outer Wrapper handles the physical wavy/wind sway motion */}
              <div 
                className="group/circle relative aspect-square w-full max-w-[400px] flex items-center justify-center cursor-pointer"
                style={{ animation: "swayMotion 6s ease-in-out infinite" }}
              >
                {/* Inner container manages the fluid shape changes, background transitions, and shadow parameters */}
                <div 
                  className="absolute inset-0 bg-secondary/20 flex items-center justify-center shadow-inner overflow-hidden transition-all duration-700 ease-out hover:bg-secondary/35 hover:shadow-md"
                  style={{ animation: "liquidWave 8s ease-in-out infinite" }}
                >
                  {/* HTML5 Canvas Active Simulation inside the shape itself */}
                  <canvas
                    ref={circleCanvasRef}
                    className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-80"
                    aria-hidden="true"
                  />

                  {/* Organic internal accent border ring */}
                  <div 
                    className="absolute inset-4 border border-primary/10 opacity-40 transition-all duration-700 ease-out group-hover/circle:scale-105 group-hover/circle:opacity-80 pointer-events-none z-10"
                    style={{ animation: "liquidWave 10s ease-in-out infinite reverse" }}
                  />
                  
                  {/* Typography Element layered smoothly on top of canvas graphics */}
                  <div className="relative z-20 text-primary/30 font-serif text-9xl italic select-none transform transition-all duration-700 ease-out -rotate-3 group-hover/circle:rotate-3 group-hover/circle:text-primary/50 group-hover/circle:scale-105">
                    T
                  </div>
                </div>
              </div>
            </div>
            
            {/* Text Column (Completely static text styles) */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-serif text-foreground mb-6">
                Rooted in Nature
              </h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Tule Cereals began with a simple belief: breakfast should be the most wholesome meal of the day.
                  Founded in 2026, we set out to reconnect people with the natural energy of whole grains.
                </p>
                <p>
                  We partner directly with farmers who share our commitment to sustainable agriculture.
                  Every grain is selected for its nutritional value and flavor character.
                  We don&apos;t just sell cereals; we deliver the harvest of the season.
                </p>
                <p>
                  From ancient grains like teff and millet to classic oats and barley, our collection
                  is a tribute to the diversity of the earth&apos;s bounty.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}