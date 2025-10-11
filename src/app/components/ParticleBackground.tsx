"use client";

import { useRef, useEffect, useState } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Shape types
    type ShapeType = "circle" | "triangle" | "square" | "hexagon";

    interface Shape {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      type: ShapeType;
      color: string;
    }

    const shapes: Shape[] = [];
    const shapeCount = 15;

    const theme: string = localStorage.getItem("theme") ?? "dark";

    // Colors for light and dark mode
    const lightColors = [
      "#ff6ec7", // hot pink
      "#ffc300", // bright yellow
      "#29b6f6", // electric blue
      "#4caf50", // vivid green
      "#ff7043", // tangerine
    ];

    const darkColors = [
      "#d500f9", // deep violet
      "#00e5ff", // cyan
      "#76ff03", // neon green
      "#ff1744", // bright red
      "#ff9100", // orange glow
    ];
    // Initialize shapes
    const initShapes = () => {
      for (let i = 0; i < shapeCount; i++) {
        const isDark = theme === "dark" ? true : false;
        const colors = isDark ? darkColors : lightColors;

        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 80 + 40,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          type: ["circle", "triangle", "square", "hexagon"][
            Math.floor(Math.random() * 4)
          ] as ShapeType,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Draw shapes
    const drawShape = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.globalAlpha = shape.opacity;
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;

      switch (shape.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.fill();
          break;

        case "square":
          ctx.fillRect(
            -shape.size / 2,
            -shape.size / 2,
            shape.size,
            shape.size
          );
          break;

        case "hexagon":
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * 60 * Math.PI) / 180;
            const x = (shape.size / 2) * Math.cos(angle);
            const y = (shape.size / 2) * Math.sin(angle);
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Bounce off edges
        if (shape.x < -shape.size || shape.x > canvas.width + shape.size) {
          shape.speedX *= -1;
        }
        if (shape.y < -shape.size || shape.y > canvas.height + shape.size) {
          shape.speedY *= -1;
        }

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        drawShape(shape);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initShapes();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-60 dark:opacity-60 transition-opacity duration-500 pointer-events-none"
    />
  );
};

export default ParticleBackground;
