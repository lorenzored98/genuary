// Inspired by Sol Lewitt
// Wall Drawing #33, 1970

import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

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

	const pad = size / 8;

	const w = size * 2;
	const h = size - pad;
	const cellSize = size / 20;

	const startIso = () => {
		ctx.save();
		ctx.translate(size / 2, pad);
		ctx.scale(1, 0.5);
		ctx.rotate((45 * Math.PI) / 180);
	};

	const endIso = () => {
		ctx.restore();
	};

	ctx.lineWidth = 2;
	ctx.strokeStyle = "white";

	for (let x = (size - w) * 2; x < w; x += cellSize) {
		startIso();
		ctx.beginPath();
		ctx.moveTo(x, pad);
		ctx.lineTo(x, h);
		ctx.closePath();
		ctx.stroke();

		endIso();
	}

	for (let y = pad; y < h + Math.floor(cellSize); y += cellSize) {
		startIso();
		ctx.beginPath();
		ctx.moveTo((size - w) * 2, y);
		ctx.lineTo(w, y);
		ctx.closePath();
		ctx.stroke();
		endIso();
	}

	for (let x = (size - w) * 2; x < w - 0.1; x += cellSize) {
		for (let y = pad; y < h - 0.1; y += cellSize) {
			const r = cellSize / 2;
			const cx = x + r;
			const cy = y + r;

			const step = 255 / 4;

			const directions = [];

			for (let i = 0; i < 3; i++) {
				startIso();

				let col = random(cx, cy, SEED + i);

				ctx.beginPath();
				ctx.lineWidth = 3;
				let dir;

				if (col < step) dir = "Horiz";
				else if (col < step * 2) dir = "Diag1";
				else if (col < step * 3) dir = "Diag2";
				else dir = "Vert";

				if (directions.indexOf(dir) > -1) {
					ctx.restore();
					break;
				}

				if (dir === "Horiz") {
					ctx.strokeStyle = "#ffd738";
					ctx.moveTo(x, y + cellSize / 2);
					ctx.lineTo(x + cellSize, y + cellSize / 2);
				} else if (dir === "Diag1") {
					ctx.strokeStyle = "#878dff";
					ctx.moveTo(x, y);
					ctx.lineTo(x + cellSize, y + cellSize);
				} else if (dir === "Diag2") {
					ctx.strokeStyle = "#ff87bd";
					ctx.moveTo(x + cellSize, y);
					ctx.lineTo(x, y + cellSize);
				} else if (dir === "Vert") {
					ctx.strokeStyle = "#7438ff";
					ctx.moveTo(x + cellSize / 2, y);
					ctx.lineTo(x + cellSize / 2, y + cellSize);
				}

				directions.push(dir);

				ctx.stroke();

				endIso();
			}
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
