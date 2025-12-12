"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Track mouse position
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 140;
    const mouseRepelDistance = 200;

    const colors = {
      light: ["#2563eb", "#9333ea", "#06b6d4"],
      dark: ["#60a5fa", "#c084fc", "#22d3ee"],
    };

    const getColors = () => (theme === "dark" ? colors.dark : colors.light);

    // 1. DEFINE CLASS
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      originalX: number;
      originalY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        // Reduced speed for a calm background effect
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        const currentColors = getColors();
        this.color =
          currentColors[Math.floor(Math.random() * currentColors.length)];
      }

      update() {
        // --- 1. RESTORED IDLE MOVEMENT ---
        this.x += this.vx;
        this.y += this.vy;

        // --- 2. WALL BOUNCE (Required for movement) ---
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // --- 3. MOUSE INTERACTION ---
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRepelDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRepelDistance - distance) / mouseRepelDistance;
          const repelStrength = 3;

          // Push away from mouse
          this.x -= forceDirectionX * force * repelStrength;
          this.y -= forceDirectionY * force * repelStrength;
        }
        // Note: Removed the "return to original position" logic because
        // free-floating particles don't have a fixed original position.
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // 2. DEFINE FUNCTIONS
    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      if (!ctx) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const p1 = particles[a];
          const p2 = particles[b];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(148, 163, 184, ${opacity * 0.2})`
                : `rgba(71, 85, 105, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initParticles(); // Ensure particles are created immediately
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, theme]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      // 'fixed' keeps it from scrolling, 'pointer-events-none' lets clicks pass through
      className="fixed inset-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
};

export default ParticleBackground;
