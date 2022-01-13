import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});
let animationFrame = 0;

const draw = () => {
	window.cancelAnimationFrame(animationFrame);

	let elapsedTime = 0;
	const LOOP_DELAY = 0.1;

	let loopDelay = LOOP_DELAY;

	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 100;
	const cellSize = size / cellCount;

	const cells = [];

	const isAlive = (i) => {
		if (cells[i].alive) {
			return 1;
		} else {
			return 0;
		}
	};

	const calcCellPower = (cell) => {
		const row = (cell.y / cellSize) * cellCount;
		const col = cell.x / cellSize;

		const index = Math.round(row + col);
		let power = 0;
		const maxCol = cellCount - 1;
		const maxRow = maxCol * cellCount;

		// Top cells
		if (row > 0) {
			if (col > 0) {
				const i = index - cellCount - 1;
				power += isAlive(i);
			}

			if (col < maxCol) {
				const i = index - cellCount + 1;
				power += isAlive(i);
			}

			const i = index - cellCount;
			power += isAlive(i);
		}
		// Bottom cells
		if (row < maxRow) {
			if (col > 0) {
				const i = index + cellCount - 1;
				power += isAlive(i);
			}

			if (col < maxCol) {
				const i = index + cellCount + 1;
				power += isAlive(i);
			}

			const i = index + cellCount;
			power += isAlive(i);
		}
		// Left
		if (col > 0) {
			const i = index - 1;
			power += isAlive(i);
		}
		// Right
		if (col < maxCol) {
			const i = index + 1;
			power += isAlive(i);
		}
		return power;
	};

	const aliveTimeToChar = (time) => {
		if (time > 0.1) {
			return "@";
		} else if (time > 0.07) {
			return "/";
		} else if (time > 0.04) {
			return "?";
		} else if (time > 0.01) {
			return "$";
		} else {
			return "#";
		}
	};

	for (let y = 0; y < size; y += cellSize) {
		for (let x = 0; x < size; x += cellSize) {
			const cell = {
				x,
				y,
				alive: Math.random() > 0.5,
				nextAlive: false,
				deathTime: 0,
				aliveTime: 0,
				char: "",
			};

			cells.push(cell);
		}
	}

	const animation = () => {
		const t = performance.now() / 1000;
		const dt = t - elapsedTime;
		elapsedTime = t;

		loopDelay -= dt;

		if (loopDelay < 0) {
			loopDelay = LOOP_DELAY;

			ctx.fillStyle = "rgb(35, 35, 39)";
			ctx.fillRect(0, 0, size, size);

			ctx.fillStyle = "green";

			for (let i = 0; i < cells.length; i++) {
				const cell = cells[i];
				const power = calcCellPower(cell);
				cell.char = aliveTimeToChar(cell.aliveTime);

				if (power === 3) {
					cell.nextAlive = true;
					cell.aliveTime = 0;
				} else {
					if (power !== 2) {
						cell.nextAlive = false;
						cell.aliveTime = 0;
					}
				}
			}

			for (let i = 0; i < cells.length; i++) {
				const cell = cells[i];
				cell.alive = cell.nextAlive;

				if (cell.alive) {
					cell.aliveTime += dt;
					ctx.fillText(cell.char, cell.x, cell.y);
				} else {
					cell.deathTime += Math.random();
					if (cell.deathTime > 100) {
						cell.alive = true;
						cell.deathTime = 0;
					}
				}
			}
		}

		animationFrame = window.requestAnimationFrame(animation);
	};

	animation();
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
