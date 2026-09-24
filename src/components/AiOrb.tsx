import React, { useEffect, useRef } from 'react';
import { OrbState } from '../types';

interface AiOrbProps {
  state: OrbState;
  amplitude: number; // 0 to 1
  onClick?: () => void;
}

export const AiOrb: React.FC<AiOrbProps> = ({ state, amplitude, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle pool for organic energy sparks
    const particles = Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      speed: 0.015 + (i % 5) * 0.005,
      radiusOffset: (i % 3) * 12,
      size: 1.5 + (i % 4) * 0.8,
      phase: i * 0.4
    }));

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Color Palette configuration based on State
      let r1 = 245, g1 = 158, b1 = 11; // Primary Saffron Gold
      let r2 = 234, g2 = 88, b2 = 12;  // Deep Amber Orange
      let rCore = 254, gCore = 243, bCore = 199; // Luminous Golden White

      if (state === 'LISTENING') {
        r1 = 249; g1 = 115; b1 = 22; // Energetic Sunset Saffron
        r2 = 239; g2 = 68; b2 = 68;  // Radiant Coral
        rCore = 255; gCore = 237; bCore = 213;
      } else if (state === 'THINKING') {
        r1 = 6; g1 = 182; b1 = 212;   // Quantum Cyan
        r2 = 59; g2 = 130; b2 = 246;  // Electric Blue
        rCore = 224; gCore = 242; bCore = 254;
      } else if (state === 'SPEAKING') {
        r1 = 16; g1 = 185; b1 = 129;  // Emerald Green
        r2 = 245; g2 = 158; b2 = 11;  // Saffron gold harmony
        rCore = 209; gCore = 250; bCore = 229;
      } else if (state === 'ERROR') {
        r1 = 239; g1 = 68; b1 = 68;
        r2 = 185; g2 = 28; b2 = 28;
        rCore = 254; gCore = 202; bCore = 202;
      } else if (state === 'SUCCESS') {
        r1 = 34; g1 = 197; b1 = 94;
        r2 = 16; g2 = 185; b2 = 129;
        rCore = 220; gCore = 252; bCore = 231;
      }

      const dynamicAmp = amplitude * 42;
      const baseRadius = 65 + Math.sin(time * 1.8) * 4 + dynamicAmp;

      // 1. Multi-layered Ambient Atmosphere Bloom
      const auraGrad = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.2,
        centerX, centerY, baseRadius * 2.4
      );
      auraGrad.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${0.35 + amplitude * 0.25})`);
      auraGrad.addColorStop(0.5, `rgba(${r2}, ${g2}, ${b2}, ${0.12 + amplitude * 0.1})`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Modern Frequency Spectrum Waveform Ring (Section 3 Voice Reactivity)
      const numBars = 36;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.2);

      for (let b = 0; b < numBars; b++) {
        const barAngle = (b / numBars) * Math.PI * 2;
        const wave = Math.sin(time * 4 + b * 0.6) * 0.5 + 0.5;
        const barHeight = 4 + (wave * 14) + (amplitude * 28);
        const innerDist = baseRadius * 1.25;

        const bx1 = Math.cos(barAngle) * innerDist;
        const by1 = Math.sin(barAngle) * innerDist;
        const bx2 = Math.cos(barAngle) * (innerDist + barHeight);
        const by2 = Math.sin(barAngle) * (innerDist + barHeight);

        ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${0.3 + (barHeight / 40) * 0.5})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(bx2, by2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Fluid Organic Plasma Membranes (Harmonic Waves)
      const layers = 3;
      for (let l = 0; l < layers; l++) {
        const layerRadius = baseRadius * (0.85 - l * 0.12);
        const speed = (l % 2 === 0 ? 1 : -1) * (1.2 + l * 0.4);
        const points = 8;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * speed * 0.25);

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const harmonic = Math.sin(time * 3 + i * 3 + l) * (6 + amplitude * 18);
          const r = layerRadius + harmonic;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            const prevAngle = ((i - 1) / points) * Math.PI * 2;
            const prevHarmonic = Math.sin(time * 3 + (i - 1) * 3 + l) * (6 + amplitude * 18);
            const prevR = layerRadius + prevHarmonic;
            const prevPx = Math.cos(prevAngle) * prevR;
            const prevPy = Math.sin(prevAngle) * prevR;

            const midAngle = (prevAngle + angle) / 2;
            const cpr = (prevR + r) / 2 + 4;
            const cx = Math.cos(midAngle) * cpr;
            const cy = Math.sin(midAngle) * cpr;

            ctx.quadraticCurveTo(cx, cy, px, py);
          }
        }
        ctx.closePath();

        const fluidGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, layerRadius * 1.1);
        fluidGrad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, ${0.9 - l * 0.15})`);
        fluidGrad.addColorStop(0.4, `rgba(${r1}, ${g1}, ${b1}, ${0.75 - l * 0.1})`);
        fluidGrad.addColorStop(0.8, `rgba(${r2}, ${g2}, ${b2}, ${0.6 - l * 0.1})`);
        fluidGrad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, 0.1)`);

        ctx.fillStyle = fluidGrad;
        ctx.shadowColor = `rgba(${r1}, ${g1}, ${b1}, 0.8)`;
        ctx.shadowBlur = 18 + amplitude * 24;
        ctx.fill();
        ctx.restore();
      }

      // 4. Luminous Heart Core
      ctx.save();
      ctx.translate(centerX, centerY);
      const coreR = (baseRadius * 0.35) + (Math.sin(time * 3) * 3) + (amplitude * 12);

      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreR);
      coreGrad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, 1)`);
      coreGrad.addColorStop(0.6, `rgba(${r1}, ${g1}, ${b1}, 0.9)`);
      coreGrad.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0)`);

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Orbiting Quantum Firefly Particles
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        pt.angle += pt.speed;
        const pR = baseRadius * 1.15 + Math.sin(time * 3 + pt.phase) * 10 + pt.radiusOffset;
        const px = centerX + Math.cos(pt.angle) * pR;
        const py = centerY + Math.sin(pt.angle) * pR;

        ctx.fillStyle = `rgba(${rCore}, ${gCore}, ${bCore}, ${0.75 + Math.sin(time * 4 + pt.phase) * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.size + amplitude * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, amplitude]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer select-none group transition-transform duration-300 active:scale-95"
      title="Pankaj Ji — Tap to Talk"
    >
      {/* Outer ambient glow backlight */}
      <div
        className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full transition-all duration-500 blur-3xl pointer-events-none opacity-40 group-hover:opacity-60 ${
          state === 'LISTENING'
            ? 'bg-amber-500'
            : state === 'THINKING'
            ? 'bg-cyan-500'
            : state === 'SPEAKING'
            ? 'bg-emerald-500'
            : state === 'ERROR'
            ? 'bg-rose-500'
            : 'bg-amber-400'
        }`}
      />

      {/* Primary Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      />

      {/* Subtle modern brand mark anchor */}
      <div className="absolute bottom-2 z-20 flex flex-col items-center pointer-events-none">
        <span className="text-[11px] font-bold tracking-[0.2em] text-amber-200/90 uppercase font-sans drop-shadow-md">
          PANKAJ JI
        </span>
      </div>
    </div>
  );
};
