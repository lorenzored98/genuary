// CREDIT TO: https://tylerxhobbs.com/essays/2020/how-to-hack-a-painting
// Diverged from this article after failing... :P

import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const rand = (min, max) => {
	let rand = 0;

	for (let i = 0; i < 6; i++) {
		rand += Math.random();
	}

	return min + (rand / 6) * (max - min);
};

const middle = (x1, y1, x2, y2) => {
	return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const segments = 20;
	const segWidth = size / 4;
	const iterations = 15;

	ctx.globalCompositeOperation = "overlay";

	const algo = (x1, y1, x2, y2, iterations) => {
		const m = middle(x1, y1, x2, y2);
		const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		const displace = rand(-len / 4, len / 4);
		m.x += displace;
		m.y += displace;
		const r = rand(0, len);

		const startAngle = Math.atan2(y1 - m.y, x1 - m.x);
		const endAngle = Math.atan2(y2 - m.y, x2 - m.x);

		let angle = rand(startAngle, endAngle);

		if (endAngle < startAngle) angle += Math.PI;

		angle = Number(angle.toFixed(3));

		const x = r * Math.cos(angle) + m.x;
		const y = r * Math.sin(angle) + m.y;

		const c = size / 2;
		let alpha = Math.sqrt(Math.pow(c - x, 2) + Math.pow(c - y, 2));

		alpha = (c - alpha) / c;

		// alpha -= 0.1;
		// ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;

		alpha -= 0.2;
		ctx.fillStyle = `rgba(150, 0, 255, ${alpha})`;

		if (alpha > 0.05) alpha *= 1.5;
		if (alpha < 0.1) alpha *= 0.1;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.fill();

		if (iterations > 0 && r > 2) {
			algo(x1, y1, x, y, iterations - 1);
			algo(x, y, x2, y2, iterations - 1);
		}
	};

	for (let i = 1; i <= segments; i += 1) {
		let j = i + 1;
		if (j > segments) {
			j = 1;
		}

		let x1 = size / 2 + segWidth * Math.cos((i * 2 * Math.PI) / segments);
		let y1 = size / 2 + segWidth * Math.sin((i * 2 * Math.PI) / segments);
		let x2 = size / 2 + segWidth * Math.cos((j * 2 * Math.PI) / segments);
		let y2 = size / 2 + segWidth * Math.sin((j * 2 * Math.PI) / segments);

		const r1 = rand(-segWidth / 10, segWidth / 10);
		const r2 = rand(-segWidth / 2, segWidth / 2);
		algo(x1 + r1, y1 + r1, x2 + r1, y2 + r1, iterations);
		algo(x1 + r2, y1 + r2, x2 + r2, y2 + r2, iterations);
		algo(x1, y1, x2, y2, iterations);
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
