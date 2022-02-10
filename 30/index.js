import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const lerp = (p0, p1, t) => {
	return {
		x: p0.x * (1 - t) + p1.x * t,
		y: p0.y * (1 - t) + p1.y * t,
	};
};

const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	const d = Math.sqrt(a * a + b * b);
	return d;
};

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const draw = () => {
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const padding = size / 8;
	const cellCount = randomInRange(4, 8);
	const cellSize = (size - padding * 2) / cellCount;

	const cells = [];
	const points = [];

	const hues = [50, 200, 280, 325];

	const hue = hues[randomInRange(0, hues.length - 1)];

	for (let y = padding; y < size - padding - cellSize / 2; y += cellSize) {
		const cy = y + cellSize / 2;
		let maxPower = -1;
		let point = null;
		for (
			let x = padding;
			x < size - padding - cellSize / 2;
			x += cellSize
		) {
			const cell = { x, y, draw: true };
			const cx = x + cellSize / 2;
			const power = random(cx, cy, SEED);

			if (power > maxPower) {
				maxPower = power;
				point = { x: cx, y: cy };
			}

			cells.push(cell);
		}

		points.push(point);
	}

	let angle = 0;

	ctx.globalCompositeOperation = "overlay";

	for (let i = 0; i < points.length - 1; i++) {
		const len = dist(
			points[i].x,
			points[i].y,
			points[i + 1].x,
			points[i + 1].y
		);

		const step = 2 / len;

		if (i + 1 < points.length) {
			for (let j = 0.0; j < 1; j += step) {
				const p = lerp(points[i], points[i + 1], j);

				angle += 0.01;
				if (angle > Math.PI * 2) {
					angle = 0;
				}

				const rMult = 0.35;

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(angle);
				ctx.translate(-p.x, -p.y);

				const value = cellSize;

				for (let k = 0; k < 5; k++) {
					const r = (value - 10 * k) * rMult;
					const a = 0.5 - 0.1 * k;
					// ctx.strokeStyle = `rgba(150, 0, 255, ${a})`;
					ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${a})`;
					ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2);
				}

				ctx.restore();
			}
		}
	}

	const bgTreshold = (35 + 35 + 39) / 3;

	const imageData = ctx.getImageData(0, 0, size, size);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const color = randomInRange(190, 255) / 255;

		let col = data[i] + data[i + 1] + data[i + 2];

		if (col / 3 > bgTreshold) {
			data[i] /= color;
			data[i + 1] /= color;
			data[i + 2] /= color;
		}
	}

	ctx.putImageData(imageData, 0, 0);

	for (let i = 0; i < cells.length; i++) {
		const { x, y } = cells[i];

		const imageData = ctx.getImageData(x, y, cellSize, cellSize);
		const data = imageData.data;

		for (let j = 0; j < data.length; j += 4) {
			const col = (data[j] + data[j + 1] + data[j + 2]) / 3;

			if (col > bgTreshold) {
				cells[i].draw = false;
				break;
			}
		}
	}

	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = "white";
	ctx.strokeRect(padding, padding, size - padding * 2, size - padding * 2);
	for (let i = 0; i < cells.length; i++) {
		const { x, y, draw } = cells[i];

		if (draw) {
			ctx.strokeRect(x, y, cellSize, cellSize);
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
