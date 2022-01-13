import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return Math.round(255 * f);
};

const draw = () => {
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 20;
	const streetThreshold = 50;
	const heightStep = 6;

	const floorColor = "#d7d2f7";
	const topColor = "#faf5ff";
	const leftColor = "#f0e0ff";
	const rightColor = "#e0c2ff";

	const padding = size / 6;
	const cellSize = (size - padding * 2) / cellCount;
	const padE = 1;

	const startIso = () => {
		ctx.save();
		ctx.translate(size / 2, padding);
		ctx.scale(1, 0.5);
		ctx.rotate((45 * Math.PI) / 180);
	};

	const endIso = () => {
		ctx.restore();
	};

	const drawBox = (x, y, size) => {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		// Top
		ctx.fillStyle = topColor;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x - size, y);
		ctx.lineTo(x - size, y - size);
		ctx.lineTo(x, y - size);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		// Left
		ctx.fillStyle = leftColor;
		ctx.beginPath();
		ctx.moveTo(x - size, y);
		ctx.lineTo(x, y + size);
		ctx.lineTo(x + size, y + size);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		// // Right
		ctx.fillStyle = rightColor;
		ctx.beginPath();
		ctx.moveTo(x + size, y);
		ctx.lineTo(x + size, y + size);
		ctx.lineTo(x, y);
		ctx.lineTo(x, y - size);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};

	for (let y = padding; y < size - padding - padE; y += cellSize) {
		for (let x = padding; x < size - padding - padE; x += cellSize) {
			const col = random(x, y, SEED);

			if (col >= streetThreshold) {
				ctx.strokeStyle = floorColor;
				ctx.fillStyle = floorColor;
				const offset = cellSize / 5;

				startIso();
				ctx.strokeRect(
					x + offset / 2,
					y + offset / 2,
					cellSize - offset,
					cellSize - offset
				);

				ctx.beginPath();
				ctx.arc(
					x + cellSize / 2,
					y + cellSize / 2,
					cellSize / 6,
					0,
					Math.PI * 2
				);
				ctx.closePath();
				ctx.fill();
				endIso();
			} else {
				const h = Math.floor(col / heightStep) + 1;
				for (let k = 0; k < h; k++) {
					startIso();
					drawBox(x - cellSize * k, y - cellSize * k, cellSize);
					endIso();
				}
			}
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
