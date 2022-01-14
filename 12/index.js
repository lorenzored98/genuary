import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return Math.round(255 * f);
};

const colorToIndent = (col) => {
	const step = 255 / 3;
	if (col < step) {
		return 0;
	} else if (col < step * 2) {
		return -1;
	} else {
		return 1;
	}
};

const draw = () => {
	const SEED = Math.random();

	const HALF_PI = Math.PI / 2;

	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	ctx.lineWidth = 0.5;
	ctx.strokeStyle = "black";

	const cellCount = 20;
	const padding = size / 15;
	const cellSize = (size - padding * 2) / cellCount;

	const halfCellSize = cellSize / 2;
	const r = cellSize / 8;

	const padE = 1;

	const green = Math.random() * 255;
	const blue = Math.random() * 255;

	const cells = [];
	for (let y = padding; y < size - padding - padE; y += cellSize) {
		const row = [];
		for (let x = padding; x < size - padding - padE; x += cellSize) {
			const colIndex = Math.round((x - padding) / cellSize);
			const rowIndex = Math.round((y - padding) / cellSize);

			const cell = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			};

			if (rowIndex > 0) {
				// Get top from 1 row up
				cell.top = cells[rowIndex - 1][colIndex].bottom * -1;
			}

			if (colIndex > 0) {
				// Get left from 1 col before
				cell.left = row[colIndex - 1].right * -1;
			}

			if (rowIndex < cellCount - 1) {
				// Generate bottom
				const col = random(x + cellSize / 2, y + cellSize, SEED);
				cell.bottom = colorToIndent(col);
			}

			if (colIndex < cellCount - 1) {
				// Generate right
				const col = random(x + cellSize, y + cellSize / 2, SEED);
				cell.right = colorToIndent(col);
			}

			const power = cell.top + cell.right + cell.bottom + cell.left;
			const baseCol = 255 / 4;
			const col = `rgb(${baseCol * power + 50}, ${green}, ${blue})`;
			ctx.fillStyle = col;

			ctx.beginPath();
			ctx.moveTo(x, y);

			ctx.lineTo(x + halfCellSize - r, y);
			if (cell.top !== 0) {
				ctx.arc(x + halfCellSize, y, r, Math.PI, 0, cell.top < 0);
			}
			ctx.lineTo(x + cellSize, y);

			ctx.lineTo(x + cellSize, y + halfCellSize - r);

			if (cell.right !== 0) {
				ctx.arc(
					x + cellSize,
					y + halfCellSize,
					r,
					-HALF_PI,
					HALF_PI,
					cell.right < 0
				);
			}
			ctx.lineTo(x + cellSize, y + cellSize);

			ctx.lineTo(x + halfCellSize + r, y + cellSize);
			if (cell.bottom !== 0) {
				ctx.arc(
					x + halfCellSize,
					y + cellSize,
					r,
					0,
					Math.PI,
					cell.bottom < 0
				);
			}
			ctx.lineTo(x, y + cellSize);

			ctx.lineTo(x, y + halfCellSize + r);
			if (cell.left !== 0) {
				ctx.arc(
					x,
					y + halfCellSize,
					r,
					HALF_PI,
					-HALF_PI,
					cell.left < 0
				);
			}

			ctx.closePath();
			ctx.fill();

			ctx.stroke();

			row.push(cell);
		}

		cells.push(row);
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
