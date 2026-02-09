"use client";

import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	size: number;
	speed: number;
	opacity: number;
}

export function StarField() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Create stars
		const stars: Star[] = [];
		const starCount = 200;

		for (let i = 0; i < starCount; i++) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 2,
				speed: Math.random() * 0.5 + 0.1,
				opacity: Math.random() * 0.5 + 0.5,
			});
		}

		// Animation loop
		let animationFrameId: number;
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			stars.forEach((star) => {
				// Update star position
				star.y += star.speed;
				if (star.y > canvas.height) {
					star.y = 0;
					star.x = Math.random() * canvas.width;
				}

				// Draw star with glow effect
				const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
				gradient.addColorStop(0, `rgba(184, 164, 232, ${star.opacity})`);
				gradient.addColorStop(0.5, `rgba(232, 180, 217, ${star.opacity * 0.5})`);
				gradient.addColorStop(1, "rgba(184, 164, 232, 0)");

				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
				ctx.fill();

				// Draw core star
				ctx.fillStyle = `rgba(250, 249, 246, ${star.opacity})`;
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fill();
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}
