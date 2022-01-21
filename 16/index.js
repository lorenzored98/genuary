import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const interpolate = (sourceCol, targetCol, t) => {
	const r = ((sourceCol.r / 255) * (1 - t) + (targetCol.r / 255) * t) * 255;
	const g = ((sourceCol.g / 255) * (1 - t) + (targetCol.g / 255) * t) * 255;
	const b = ((sourceCol.b / 255) * (1 - t) + (targetCol.b / 255) * t) * 255;
	return { r, g, b };
};

const draw = () => {
	const SEED = Math.random();

	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 10;
	const padding = size / 8;
	const cellSize = (size - padding * 2) / cellCount;

	const padE = 1;

	const colorStep = 255 / cellCount;

	const calcCellColor = (cell) => {
		const row = ((cell.y - padding) / cellSize) * cellCount;
		const col = (cell.x - padding) / cellSize;

		const index = Math.round(row + col);
		const maxCol = cellCount - 1;
		const maxRow = maxCol * cellCount;

		let color = { ...cell.color };

		// Top cells
		if (row > 0) {
			if (col > 0) {
				const i = index - cellCount - 1;
				color = interpolate(color, cells[i].color, cell.power);
			}

			if (col < maxCol) {
				const i = index - cellCount + 1;
				color = interpolate(color, cells[i].color, cell.power);
			}

			const i = index - cellCount;
			color = interpolate(color, cells[i].color, cell.power);
		}

		// Bottom cells
		if (row < maxRow) {
			if (col > 0) {
				const i = index + cellCount - 1;
				color = interpolate(color, cells[i].color, cell.power);
			}

			if (col < maxCol) {
				const i = index + cellCount + 1;
				color = interpolate(color, cells[i].color, cell.power);
			}

			const i = index + cellCount;
			color = interpolate(color, cells[i].color, cell.power);
		}
		// Left
		if (col > 0) {
			const i = index - 1;
			color = interpolate(color, cells[i].color, cell.power);
		}
		// Right
		if (col < maxCol) {
			const i = index + 1;
			color = interpolate(color, cells[i].color, cell.power);
		}

		return color;
	};

	const cells = [];

	for (let y = padding; y < size - padding - padE; y += cellSize) {
		for (let x = padding; x < size - padding - padE; x += cellSize) {
			const xCol = colorStep * (x / cellSize);
			const yCol = colorStep * (y / cellSize);

			const power = random(x, y, SEED);

			ctx.fillStyle = `rgb(${xCol}, 100, ${yCol})`;
			ctx.fillRect(x, y, cellSize, cellSize);

			const cell = {
				x,
				y,
				color: {
					r: xCol,
					g: 100,
					b: yCol,
				},
				power,
			};

			cells.push(cell);
		}
	}

	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		const { r, g, b } = calcCellColor(cell);
		cell.r = r;
		cell.g = g;
		cell.b = b;

		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
