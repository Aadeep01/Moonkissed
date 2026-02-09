"use client";

import { useEffect, useRef } from "react";

export function CosmicBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let time = 0;

		const particles: {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			opacity: number;
		}[] = [];

		// Noise texture for "grainy" film look - renders once off-screen
		const noiseCanvas = document.createElement("canvas");
		let noisePattern: CanvasPattern | null = null;

		const createNoise = () => {
			noiseCanvas.width = 200; // Small tile
			noiseCanvas.height = 200;
			const noiseCtx = noiseCanvas.getContext("2d");
			if (!noiseCtx) return;

			const idata = noiseCtx.createImageData(200, 200);
			const buffer32 = new Uint32Array(idata.data.buffer);
			const len = buffer32.length;

			for (let i = 0; i < len; i++) {
				if (Math.random() < 0.1) {
					// Scattered white noise, very transparent
					buffer32[i] = 0x08ffffff;
				}
			}
			noiseCtx.putImageData(idata, 0, 0);
			noisePattern = ctx.createPattern(noiseCanvas, "repeat");
		};

		const initParticles = () => {
			const particleCount = 40; // Very sparse
			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: Math.random() * 1.2,
					speedX: (Math.random() - 0.5) * 0.05,
					speedY: (Math.random() - 0.5) * 0.05,
					opacity: Math.random() * 0.5 + 0.1,
				});
			}
		};

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			createNoise();
		};

		resizeCanvas();
		initParticles();
		window.addEventListener("resize", resizeCanvas);

		const animate = () => {
			time += 0.001; // Ultra slow movement

			// 1. Solid Dark Base
			ctx.fillStyle = "#050810"; // Almost black
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 2. Liquid Gradients (Subtle moving lights)
			// Avoid perfect circles; use composite operations for blending
			ctx.globalCompositeOperation = "screen";

			const cx = canvas.width / 2;
			const cy = canvas.height / 2;

			// Light 1: Slow drifting violet nebula
			const grad1 = ctx.createRadialGradient(
				cx + Math.sin(time * 0.5) * 300,
				cy + Math.cos(time * 0.3) * 200,
				0,
				cx + Math.sin(time * 0.5) * 300,
				cy + Math.cos(time * 0.3) * 200,
				800,
			);
			grad1.addColorStop(0, "rgba(40, 30, 80, 0.15)");
			grad1.addColorStop(1, "transparent");

			ctx.fillStyle = grad1;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Light 2: Muted teal drift (bottom right)
			const grad2 = ctx.createRadialGradient(
				canvas.width * 0.8,
				canvas.height * 0.8 + Math.sin(time) * 100,
				0,
				canvas.width * 0.8,
				canvas.height * 0.8 + Math.sin(time) * 100,
				600,
			);
			grad2.addColorStop(0, "rgba(20, 40, 60, 0.12)");
			grad2.addColorStop(1, "transparent");

			ctx.fillStyle = grad2;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.globalCompositeOperation = "source-over";

			// 3. Stars (Tiny, sharp points, no blur)
			particles.forEach((p) => {
				p.x += p.speedX;
				p.y += p.speedY;

				// Wrap around screen
				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;

				ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
			});

			// 4. Global Grain Overlay (The "Film" Look)
			if (noisePattern) {
				ctx.fillStyle = noisePattern;
				ctx.globalCompositeOperation = "overlay";
				ctx.globalAlpha = 0.08; // Very subtle texture
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.globalAlpha = 1.0;
			}

			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0 -z-30 pointer-events-none" />;
}
