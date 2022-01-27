const main = document.querySelector("main");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Day 12 Packing + Day 13 800x80;

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

let width = 800;
let height = 80;

function draw() {
	const SEED = Math.random();
	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, width, height);

	const cellCount = 50;
	const cellSize = width / cellCount;
	const iterations = 10000;
	const cellPad = 1 / window.devicePixelRatio;

	let topCount = 0;
	let bottomCount = 0;
	let leftCount = 0;
	let rightCount = 0;

	const cells = [];

	for (let y = 0; y < height; y += cellSize) {
		const row = [];
		for (let x = 0; x < width; x += cellSize) {
			const power = random(x, y, SEED);

			row.push({ x, y, filled: false, power });
		}
		cells.push(row);
	}

	const drawTop = (cell, top, left, right) => {
		ctx.fillRect(
			left.x + cellPad,
			left.y + cellPad,
			cellSize * 3 - cellPad * 2,
			cellSize - cellPad * 2
		);

		ctx.fillRect(
			top.x + cellPad,
			top.y + cellPad,
			cellSize - cellPad * 2,
			cellSize
		);

		cell.filled = true;
		top.filled = true;
		left.filled = true;
		right.filled = true;

		topCount++;
	};

	const drawBottom = (cell, bottom, left, right) => {
		ctx.fillRect(
			left.x + cellPad,
			left.y + cellPad,
			cellSize * 3 - cellPad * 2,
			cellSize - cellPad * 2
		);

		ctx.fillRect(
			bottom.x + cellPad,
			bottom.y - cellPad,
			cellSize - cellPad * 2,
			cellSize
		);

		cell.filled = true;
		bottom.filled = true;
		left.filled = true;
		right.filled = true;

		bottomCount++;
	};

	const drawLeft = (cell, left, top, bottom) => {
		ctx.fillRect(
			top.x + cellPad,
			top.y + cellPad,
			cellSize - cellPad * 2,
			cellSize * 3 - cellPad * 2
		);

		ctx.fillRect(
			left.x + cellPad,
			left.y + cellPad,
			cellSize,
			cellSize - cellPad * 2
		);

		cell.filled = true;
		left.filled = true;
		top.filled = true;
		bottom.filled = true;

		leftCount++;
	};

	const drawRight = (cell, right, top, bottom) => {
		ctx.fillRect(
			top.x + cellPad,
			top.y + cellPad,
			cellSize - cellPad * 2,
			cellSize * 3 - cellPad * 2
		);

		ctx.fillRect(
			right.x - cellPad,
			right.y + cellPad,
			cellSize,
			cellSize - cellPad * 2
		);

		cell.filled = true;
		right.filled = true;
		top.filled = true;
		bottom.filled = true;

		rightCount++;
	};

	const drawCross = (cell, top, bottom, left, right) => {
		ctx.fillRect(
			left.x + cellPad,
			left.y + cellPad,
			cellSize * 3 - cellPad * 2,
			cellSize - cellPad * 2
		);

		ctx.fillRect(
			top.x + cellPad,
			top.y + cellPad,
			cellSize - cellPad * 2,
			cellSize * 3 - cellPad * 2
		);

		cell.filled = true;
		top.filled = true;
		bottom.filled = true;
		left.filled = true;
		right.filled = true;
	};

	const drawHoriz = (cell, left, right) => {
		ctx.fillRect(
			left.x + cellPad,
			left.y + cellPad,
			cellSize * 3 - cellPad * 2,
			cellSize - cellPad * 2
		);

		cell.filled = true;
		left.filled = true;
		right.filled = true;
	};

	const drawVert = (cell, top, bottom) => {
		ctx.fillRect(
			top.x + cellPad,
			top.y + cellPad,
			cellSize - cellPad * 2,
			cellSize * 3 - cellPad * 2
		);

		cell.filled = true;
		top.filled = true;
		bottom.filled = true;
	};

	const getTargetCells = (i, j) => {
		const row = cells[i];
		const cell = row[j];

		if (cell.filled) return null;

		const targetCells = {
			cell,
			top: null,
			bottom: null,
			left: null,
			right: null,
		};

		if (i > 0) {
			const cell = cells[i - 1][j];
			targetCells.top = cell;
		} else {
			targetCells.top = { filled: true, power: -1 };
		}

		if (i < cellCount * 0.1 - 1) {
			const cell = cells[i + 1][j];
			targetCells.bottom = cell;
		} else {
			targetCells.bottom = { filled: true, power: -1 };
		}

		if (j > 0) {
			const cell = row[j - 1];
			targetCells.left = cell;
		} else {
			targetCells.left = { filled: true, power: -1 };
		}

		if (j < cellCount - 1) {
			const cell = row[j + 1];
			targetCells.right = cell;
		} else {
			targetCells.right = { filled: true, power: -1 };
		}

		return targetCells;
	};

	const randomPass = () => {
		const i = randomInRange(0, cells.length - 1);
		const row = cells[i];
		const j = randomInRange(0, row.length - 1);

		const targetCells = getTargetCells(i, j);

		if (!targetCells) return;

		const { cell, top, bottom, left, right } = targetCells;

		const maxPower = Math.max(
			top.filled ? -1 : top.power,
			bottom.filled ? -1 : bottom.power,
			left.filled ? -1 : left.power,
			right.filled ? -1 : right.power,
			cell.power
		);

		if (maxPower === top.power) {
			if (!left.filled && !right.filled) {
				drawTop(cell, top, left, right);
			}
		} else if (maxPower === bottom.power) {
			if (!left.filled && !right.filled) {
				drawBottom(cell, bottom, left, right);
			}
		} else if (maxPower === left.power) {
			if (!top.filled && !bottom.filled) {
				drawLeft(cell, left, top, bottom);
			}
		} else if (maxPower === right.power) {
			if (!top.filled && !bottom.filled) {
				drawRight(cell, right, top, bottom);
			}
		} else {
			if (
				!top.filled &&
				!bottom.filled &&
				!left.filled &&
				!right.filled
			) {
				drawCross(cell, top, bottom, left, right);
			}
		}
	};

	const fillPass = () => {
		for (let i = 0; i < cells.length; i++) {
			const row = cells[i];
			loop2: for (let j = 0; j < row.length; j++) {
				const targetCells = getTargetCells(i, j);
				if (!targetCells) continue;

				const { cell, top, bottom, left, right } = targetCells;

				if (cell.filled) continue;

				const prioQueue = [
					topCount,
					bottomCount,
					leftCount,
					rightCount,
				];

				prioQueue.sort((a, b) => {
					if (a < b) return -1;
					else if (a > b) return 1;
					else return 0;
				});

				for (let k = 0; k < prioQueue.length; k++) {
					if (prioQueue[k] === topCount) {
						if (!top.filled && !left.filled && !right.filled) {
							drawTop(cell, top, left, right);
							continue loop2;
						}
					} else if (prioQueue[k] === bottomCount) {
						if (!bottom.filled && !left.filled && !right.filled) {
							drawBottom(cell, bottom, left, right);
							continue loop2;
						}
					} else if (prioQueue[k] === leftCount) {
						if (!left.filled && !top.filled && !bottom.filled) {
							drawLeft(cell, left, top, bottom);
							continue loop2;
						}
					} else if (prioQueue[k] === rightCount) {
						if (!right.filled && !top.filled && !bottom.filled) {
							drawRight(cell, right, top, bottom);
							continue loop2;
						}
					}
				}

				if (!left.filled && !right.filled) {
					drawHoriz(cell, left, right);
				} else if (!top.filled && !bottom.filled) {
					drawVert(cell, top, bottom);
				}
			}
		}
	};

	ctx.fillStyle = "#6224ff";

	for (let i = 0; i < iterations; i++) {
		randomPass();
	}

	fillPass();

	ctx.fillStyle = "#ffe047";

	for (let i = 0; i < cells.length; i++) {
		const row = cells[i];
		for (let j = 0; j < row.length; j++) {
			const cell = row[j];
			if (!cell.filled) {
				ctx.fillRect(
					cell.x + cellPad,
					cell.y + cellPad,
					cellSize - cellPad * 2,
					cellSize - cellPad * 2
				);
			}
		}
	}

	const imageData = ctx.getImageData(0, 0, width, height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const color = randomInRange(230, 255) / 255;

		data[i] *= color;
		data[i + 1] *= color;
		data[i + 2] *= color;
	}

	ctx.putImageData(imageData, 0, 0);
}

function resize() {
	width = Math.min(window.innerWidth, window.innerHeight);
	width -= 100;

	width = Math.min(width, 800);
	height = width * 0.1;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	const dpr = window.devicePixelRatio;

	width *= dpr;
	height *= dpr;

	canvas.width = width;
	canvas.height = height;

	draw();
}

window.addEventListener("resize", resize, { passive: true });

resize();

main.appendChild(canvas);
