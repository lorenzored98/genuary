import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return Math.round(255 * f);
};

// I'm sure there is a math way to do this but I don't know it :P
const angleToVector = (angle) => {
	// 8 cells * but i want half segment
	const seg = 360 / 16;

	if (angle >= seg && angle < 45 + seg) {
		return [1, -1];
	} else if (angle >= 45 + seg && angle < 90 + seg) {
		return [1, 0];
	} else if (angle >= 90 + seg && angle < 135 + seg) {
		return [1, 1];
	} else if (angle >= 135 + seg && angle < 180 + seg) {
		return [0, 1];
	} else if (angle >= 180 + seg && angle < 225 + seg) {
		return [-1, 1];
	} else if (angle >= 225 + seg && angle < 270 + seg) {
		return [-1, 0];
	} else if (angle >= 270 + seg && angle < 315 + seg) {
		return [-1, -1];
	} else {
		return [0, -1];
	}
};

// Takes offset from our cell and returns new cell.
// Offsets range from -1 to 1
const getVectorCell = (arr, cell) => {
	// can also return out of bound
	const x = cell.row + cell.vector[1];
	const y = cell.col + cell.vector[0];

	if (x < 0 || y < 0 || x >= arr.length || y >= arr.length) return null;

	const vectorCell = arr[x][y];
	if (!vectorCell) return null;

	return vectorCell;
};

const draw = () => {
	const RAN_SEED = Math.random();

	const ctx = canvas.ctx;
	const size = canvas.size;

	// 2d array of cells
	const cellsArray = [];

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	ctx.strokeStyle = "white";

	const cellCount = 20;
	const padding = 0;
	const cellSize = (size - padding * 2) / cellCount;

	const padE = 1;

	// Cells
	for (let y = padding; y < size - padding - padE; y += cellSize) {
		const row = [];
		for (let x = padding; x < size - padding - padE; x += cellSize) {
			const r = cellSize / 2;
			const cx = x + r;
			const cy = y + r;

			const color = random(cx, cy, RAN_SEED);
			let angle = (color * 360) / 255;

			const cell = {
				vector: angleToVector(angle),
				cx,
				cy,
				row: cellsArray.length,
				col: row.length,
				id: Math.random(),
			};

			row.push(cell);
		}

		cellsArray.push(row);
	}

	// Draw
	const checkedIds = [];
	for (let i = 0; i < cellsArray.length; i++) {
		const row = cellsArray[i];
		for (let j = 0; j < row.length; j++) {
			let cell = row[j];
			let targetCell = getVectorCell(cellsArray, cell);

			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			ctx.beginPath();

			while (targetCell) {
				if (checkedIds.indexOf(targetCell.id) > -1) break;

				checkedIds.push(targetCell.id);
				for (let k = -1; k < 2; k++) {
					const offset = 5 * k;
					ctx.lineWidth = ((cellSize / 12) * offset) / 2;
					ctx.moveTo(cell.cx + offset, cell.cy - offset);
					ctx.lineTo(targetCell.cx - offset, targetCell.cy + offset);
				}

				cell = targetCell;
				targetCell = getVectorCell(cellsArray, cell);
			}

			ctx.strokeStyle = "pink";
			ctx.closePath();
			ctx.stroke();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
