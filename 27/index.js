import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const distSquared = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	return a * a + b * b;
};

const draw = () => {
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const colors = ["#2E294E", "#541388", "#F1E9DA", "#FFD400", "#D90368"];

	const cellCount = 10;
	const padding = size / 8;
	const cellSize = (size - padding * 2) / cellCount;

	for (let x = padding; x < size - padding - cellSize / 2; x += cellSize) {
		for (
			let y = padding;
			y < size - padding - cellSize / 2;
			y += cellSize
		) {
			const bgIndex = randomInRange(0, colors.length - 1);
			let colIndex = bgIndex;

			while (colIndex === bgIndex) {
				colIndex = randomInRange(0, colors.length - 1);
			}

			const power1 = random(x, y, SEED);

			const d1 = [];

			if (power1 < 0.25) {
				d1.push(0, -1);
			} else if (power1 < 0.5) {
				d1.push(1, 0);
			} else if (power1 < 0.75) {
				d1.push(0, 1);
			} else {
				d1.push(-1, 0);
			}

			const r = cellSize / 2;

			const cx = x + r;
			const cy = y + r;

			const x1 = cx + r * d1[0];
			const y1 = cy + r * d1[1];

			const power2 = random(x + r, y + r, SEED);

			const d2 = [];

			if (power2 < 0.25) {
				d2.push(-1, -1);
			} else if (power2 < 0.5) {
				d2.push(1, -1);
			} else if (power2 < 0.75) {
				d2.push(1, 1);
			} else {
				d2.push(-1, 1);
			}

			const x2 = cx + r * d2[0];
			const y2 = cy + r * d2[1];

			ctx.fillStyle = colors[bgIndex];
			ctx.fillRect(x, y, cellSize, cellSize);

			let x3;
			let y3;

			let minDist = Number.POSITIVE_INFINITY;

			const vertices = [
				{ x, y },
				{ x: x + cellSize, y: y },
				{ x: x + cellSize, y: y + cellSize },
				{ x, y: y + cellSize },
			];

			for (let i = 0; i < vertices.length; i++) {
				const { x, y } = vertices[i];

				const d1 = distSquared(x, y, x1, y1);
				const d2 = distSquared(x, y, x2, y2);
				const d = d1 + d2;

				if (d < minDist) {
					minDist = d;
					x3 = x;
					y3 = y;
				} else if (d === minDist) {
					if (d1 < d2) {
						x3 = x;
						y3 = y;
					}
				}
			}

			ctx.fillStyle = colors[colIndex];

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(cx, cy);
			ctx.lineTo(x2, y2);

			if (x3 === x2 && y3 === y2) {
				ctx.closePath();
			} else {
				ctx.lineTo(x3, y3);
				ctx.closePath();
			}

			ctx.fill();
		}
	}

	const imageData = ctx.getImageData(
		padding,
		padding,
		size - padding * 2,
		size - padding * 2
	);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const color = randomInRange(230, 255) / 255;

		data[i] *= color;
		data[i + 1] *= color;
		data[i + 2] *= color;
	}

	ctx.putImageData(imageData, padding, padding);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
