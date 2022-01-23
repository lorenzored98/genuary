import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const rand = (min, max) => {
	let rand = 0;

	for (let i = 0; i < 8; i++) {
		rand += Math.random();
	}

	return Math.floor(min + (rand / 6) * (max - min));
};

const lerp = (v0, v1, t) => {
	return v0 * (1 - t) + v1 * t;
};

const getSimilar = (p1, p2) => {
	return Math.abs(p1 - p2);
};

const scaleCell = (cell, targetCell) => {
	targetCell.scale = Math.max(cell.scale - 0.03, 0);
};

const draw = () => {
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 15;
	const padding = size / 8;
	const cellSize = (size - padding * 2) / cellCount;
	const cellPad = cellSize / 8;

	const padE = 1;

	const cells = [];

	const move = (cell) => {
		paint(cell);
		cell.connected = true;

		const row = Math.round((cell.y - padding) / cellSize);
		const col = Math.round((cell.x - padding) / cellSize);

		let similar = 1;
		let targetCell = null;

		if (row > 0) {
			const newCell = cells[row - 1][col];
			if (!newCell.connected) {
				const s = getSimilar(cell.power, newCell.power);
				if (s < similar) {
					targetCell = newCell;
					similar = s;
				}
			}
		}

		if (row < cellCount - 1) {
			const newCell = cells[row + 1][col];
			if (!newCell.connected) {
				const s = getSimilar(cell.power, newCell.power);
				if (s < similar) {
					targetCell = newCell;
					similar = s;
				}
			}
		}

		if (col > 0) {
			const newCell = cells[row][col - 1];
			if (!newCell.connected) {
				const s = getSimilar(cell.power, newCell.power);
				if (s < similar) {
					targetCell = newCell;
					similar = s;
				}
			}
		}

		if (col < cellCount - 1) {
			const newCell = cells[row][col + 1];
			if (!newCell.connected) {
				const s = getSimilar(cell.power, newCell.power);
				if (s < similar) {
					targetCell = newCell;
					similar = s;
				}
			}
		}

		if (targetCell) {
			scaleCell(cell, targetCell);
			move(targetCell);
		}
	};

	const paint = (cell) => {
		ctx.fillStyle = "rgb(102, 0, 255)";

		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgb(255, 200, 0)";

		const scaleDiff =
			(cellSize - cellPad - (cellSize - cellPad) * cell.scale) / 2;

		const x = cell.x + cellPad / 2 + scaleDiff;
		const y = cell.y + cellPad / 2 + scaleDiff;
		const size = (cellSize - cellPad) * cell.scale;

		ctx.fillRect(x, y, size, size);
		ctx.strokeRect(x, y, size, size);
	};

	for (let y = padding; y < size - padding - padE; y += cellSize) {
		const row = [];
		for (let x = padding; x < size - padding - padE; x += cellSize) {
			const power = random(x, y, SEED);

			const cell = { x, y, connected: false, power, scale: 1 };
			row.push(cell);
		}

		cells.push(row);
	}

	const i = rand(
		cellCount / 2 - cellCount / 4,
		cellCount / 2 + cellCount / 4
	);
	const j = rand(
		cellCount / 2 - cellCount / 4,
		cellCount / 2 + cellCount / 4
	);
	const cell = cells[i][j];

	paint(cell);

	cell.connected = true;

	const tC = cells[i][j - 1];
	scaleCell(cell, tC);
	move(tC);

	const bC = cells[i][j + 1];
	scaleCell(cell, bC);
	move(bC);

	const lC = cells[i - 1][j];
	scaleCell(cell, lC);
	move(lC);

	const rC = cells[i + 1][j];
	scaleCell(cell, rC);
	move(rC);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
