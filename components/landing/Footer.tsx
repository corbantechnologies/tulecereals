"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const footerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = footerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener("resize", handleResize);

    // Exact matching background structures from the hero section
    const blobs = [
      { x: width * 0.2, y: height * 0.7, radius: 160, vx: 0.2, vy: -0.15, color: "rgba(141, 110, 99, 0.04)" }, 
      { x: width * 0.8, y: height * 0.3, radius: 200, vx: -0.2, vy: 0.15, color: "rgba(212, 163, 115, 0.04)" } 
    ];

    const particles: Array<{ x: number; y: number; radius: number; speedY: number; angle: number; spin: number }> = [];
    const particleCount = 20; // Calm grain density for structural balance at base

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 1,
        speedY: -(Math.random() * 0.3 + 0.1),
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.01 - 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Ambient Morphing Blobs
      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x - blob.radius < -20 || blob.x + blob.radius > width + 20) blob.vx *= -1;
        if (blob.y - blob.radius < -20 || blob.y + blob.radius > height + 20) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 5, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Floating Grain Elements
      ctx.fillStyle = "rgba(141, 110, 99, 0.12)";
      particles.forEach((p) => {
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer className="relative bg-secondary/30 pt-20 pb-10 overflow-hidden">
      {/* Abstract Background Layer Matching Hero Gradient Physics */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* HTML5 Canvas Active Ambient Fluid Animation */}
      <canvas
        ref={footerCanvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-serif font-bold text-foreground mb-6 block select-none">
              Tule Cereals
            </Link>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Delivering nature&apos;s finest grains and cereals directly to your table.
              Wholesome, fresh, and sustainably sourced.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links: Shop */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 select-none">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-foreground/70 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=grains" className="text-foreground/70 hover:text-primary transition-colors">Grains</Link></li>
              <li><Link href="/shop?category=cereals" className="text-foreground/70 hover:text-primary transition-colors">Cereals</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 select-none">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-foreground/70 hover:text-primary transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="text-foreground/70 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 select-none">Farm Fresh News</h4>
            <p className="text-foreground/70 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-white/90 border border-secondary backdrop-blur-sm focus:outline-none focus:border-primary w-full transition-colors"
              />
              <button className="px-4 py-3 bg-foreground text-background hover:bg-primary hover:text-white transition-colors font-medium">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Base */}
        <div className="border-t border-secondary/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>© 2026 Tule Cereals. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}