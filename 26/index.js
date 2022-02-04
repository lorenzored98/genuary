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

const draw = () => {
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 100;
	const padding = size / 8;
	const cSize = size - padding * 2;
	const cellSize = cSize / cellCount;

	const blockMaxH = cSize * 0.8;
	const blockMinH = cSize * 0.4;

	const iterations = 3;

	const hue = Math.random() * 360;
	ctx.fillStyle = `hsl(${hue}, 100%, 10%)`;
	ctx.fillRect(padding, padding, cSize, cSize);

	const createBlocks = () => {
		let l = 100;
		const topX = randomInRange(0, cellCount / 4);
		const topX2 =
			topX + Math.ceil(randomInRange(cellCount / 5, cellCount / 3));

		for (let x = topX; x < topX2; x++) {
			ctx.fillStyle = `hsl(${hue}, 100%, ${l}%)`;

			const x1 = x * cellSize + padding;
			const h = randomInRange(blockMinH, blockMaxH);

			ctx.fillRect(x1, padding, cellSize, h);

			if (l === 100) {
				l = 50;
			} else {
				l = 100;
			}
		}

		let botX2 = Math.ceil(randomInRange(cellCount / 5, cellCount / 3));
		const botX =
			Math.floor(randomInRange(cellCount * 0.75, cellCount)) - botX2;
		botX2 += botX;

		for (let x = botX; x < botX2; x++) {
			ctx.fillStyle = `hsl(${hue}, 100%, ${l}%)`;

			const x1 = x * cellSize + padding;
			const h = randomInRange(blockMinH, blockMaxH);
			const y1 = cSize - h + padding;

			ctx.fillRect(x1, y1, cellSize, h);

			if (l === 100) {
				l = 50;
			} else {
				l = 100;
			}
		}
	};

	const randomFill = () => {
		for (
			let x = padding;
			x < size - padding - cellSize / 2;
			x += cellSize
		) {
			for (let i = 0; i < iterations; i++) {
				ctx.strokeRect(x, padding, cellSize, cSize);

				const y = randomInRange(padding, cSize);
				const maxHeight = size - y - padding;
				const height = randomInRange(0, maxHeight);
				const r = random(x, y, SEED + i);

				if (r > 0.1 && r < 0.2) {
					ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
				} else if (r > 0.7 && r < 0.8) {
					ctx.fillStyle = `hsl(${hue}, 100%, 100%)`;
				} else {
					continue;
				}

				if (height < cSize / 30) continue;

				ctx.fillRect(x, y, cellSize, height);
			}
		}
	};

	ctx.strokeStyle = "rgb(35, 35, 39)";
	ctx.strokeRect(padding, padding, cSize, cSize);

	createBlocks();
	randomFill();

	const imageData = ctx.getImageData(padding, padding, cSize, cSize);

	const data = imageData.data;

	for (let i = 0; i < data.length; i += 6) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];

		const rand = Math.random() + 1;
		const newPixel = [r * rand, g * rand, b * rand, a];

		data[i] = newPixel[0];
		data[i + 1] = newPixel[1];
		data[i + 2] = newPixel[2];
		data[i + 3] = newPixel[3];

		const quantError = [
			r - newPixel[0],
			g - newPixel[1],
			b - newPixel[2],
			a - newPixel[3],
		];

		const diff = 7 / 16;
		data[i + 4] = data[i + 4] + quantError[0] * diff;
		data[i + 5] = data[i + 5] + quantError[1] * diff;
		data[i + 6] = data[i + 6] + quantError[2] * diff;
		data[i + 7] = data[i + 7] + quantError[3] * diff;

		let j = i;

		j += cSize;
		j -= 4;

		for (let k = 0; k < 3; k++) {
			let diff;
			if (k === 0) {
				diff = 3 / 16;
			} else if (k === 1) {
				diff = 5 / 16;
			} else if (k === 2) {
				diff = 1 / 16;
			}

			data[j + 0] = data[j + 0] + quantError[0] * diff;
			data[j + 1] = data[j + 1] + quantError[1] * diff;
			data[j + 2] = data[j + 2] + quantError[2] * diff;
			data[j + 3] = data[j + 3] + quantError[3] * diff;

			j += 4;
		}
	}

	ctx.putImageData(imageData, padding, padding);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
