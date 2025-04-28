
"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const AuroraBackground = ({
  children,
  className,
  performance = "auto", // "low", "medium", "high", or "auto"
}: {
  children: React.ReactNode;
  className?: string;
  performance?: "low" | "medium" | "high" | "auto";
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLowPoweredDevice, setIsLowPoweredDevice] = useState(false);
  
  useEffect(() => {
    // Auto-detect device performance
    if (performance === "auto") {
      // Simple heuristic: check if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsLowPoweredDevice(isMobile);
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    let animationFrameId: number;
    let lastFrameTime = 0;
    const targetFPS = 30; // Limit to 30 FPS instead of 60
    const frameInterval = 1000 / targetFPS;
    
    // Optimize number of bubbles based on performance setting
    let bubbleDensity: number;
    switch (performance) {
      case "low":
        bubbleDensity = 40; // Much fewer bubbles
        break;
      case "medium":
        bubbleDensity = 25;
        break;
      case "high":
        bubbleDensity = 15; // Original density
        break;
      case "auto":
        bubbleDensity = isLowPoweredDevice ? 40 : 20;
        break;
      default:
        bubbleDensity = 20;
    }
    
    // Aurora parameters
    const auroraColors = [
      { r: 128, g: 84, b: 161 },  // Purple (mkranker-purple)
      { r: 59, g: 130, b: 246 },  // Blue (mkranker-blue)
      { r: 245, g: 245, b: 249 }, // Light gray
    ];
    
    const bubbles: {
      x: number;
      y: number;
      radius: number;
      color: { r: number; g: number; b: number };
      vx: number;
      vy: number;
      alpha: number;
    }[] = [];
    
    const generateBubbles = () => {
      // Calculate number of bubbles based on screen size and performance setting
      const numBubbles = Math.floor(window.innerWidth / bubbleDensity);
      
      for (let i = 0; i < numBubbles; i++) {
        const radius = Math.random() * 100 + 50;
        const color = auroraColors[Math.floor(Math.random() * auroraColors.length)];
        
        bubbles.push({
          x: Math.random() * (canvas.width + 200) - 100,
          y: Math.random() * (canvas.height + 200) - 100,
          radius,
          color,
          vx: (Math.random() - 0.5) * 0.1, // Reduced speed
          vy: (Math.random() - 0.5) * 0.1, // Reduced speed
          alpha: Math.random() * 0.25 + 0.05 // Lower alpha for subtlety
        });
      }
    };
    
    generateBubbles();
    
    const render = (timestamp: number) => {
      // Throttle the animation frame rate
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply blur for smoother effect
      ctx.filter = "blur(80px)";
      
      // Draw and update bubbles
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        
        const gradient = ctx.createRadialGradient(
          bubble.x, 
          bubble.y, 
          0, 
          bubble.x, 
          bubble.y, 
          bubble.radius
        );
        
        gradient.addColorStop(0, `rgba(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b}, ${bubble.alpha})`);
        gradient.addColorStop(1, `rgba(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Move bubbles slowly (only every other frame to reduce calculations)
        if (timestamp % 2 === 0) {
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;
          
          // Wrap around edges with buffer
          const buffer = bubble.radius * 2;
          if (bubble.x < -buffer) bubble.x = canvas.width + buffer;
          if (bubble.x > canvas.width + buffer) bubble.x = -buffer;
          if (bubble.y < -buffer) bubble.y = canvas.height + buffer;
          if (bubble.y > canvas.height + buffer) bubble.y = -buffer;
        }
      });
      
      ctx.filter = "none";
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [performance, isLowPoweredDevice]);
  
  return (
    <div className={cn("relative overflow-hidden w-full", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
