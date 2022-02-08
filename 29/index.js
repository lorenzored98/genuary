import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 3;
	const padding = size / 4;
	const cellSize = (size - padding * 2) / cellCount;
	const hStep = size / 100;
	const floorHoles = 2;

	const cells = [];

	for (let y = padding; y < size - padding - cellSize / 2; y += cellSize) {
		for (
			let x = padding;
			x < size - padding - cellSize / 2;
			x += cellSize
		) {
			const cell = { x, y };

			cells.push(cell);
		}
	}

	ctx.save();
	ctx.translate(size / 2, padding);
	ctx.scale(1, 0.5);
	ctx.rotate((45 * Math.PI) / 180);

	for (let h = size / 2 - padding; h > -size / 2 - padding / 6; h -= hStep) {
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			const x = cell.x + h;
			const y = cell.y + h;
			ctx.strokeStyle = "grey";
			ctx.lineWidth = 1;
			ctx.strokeRect(x, y, cellSize, cellSize);
		}
	}

	ctx.beginPath();
	let moved = false;

	for (let h = size / 2 - padding; h > -size / 2 - padding / 6; h -= hStep) {
		ctx.globalCompositeOperation = "source-over";
		const indices = [];

		for (let i = 0; i < floorHoles; i++) {
			let index = randomInRange(0, cells.length - 1);
			while (indices.indexOf(index) > -1) {
				index = randomInRange(0, cells.length - 1);
			}
			indices.push(index);
		}

		for (const i of indices) {
			const cell = cells[i];
			const x = cell.x + h;
			const y = cell.y + h;
			ctx.strokeStyle = "rgb(255, 208, 18)";
			ctx.lineWidth = 3;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";

			const s = cellSize / 2;
			ctx.strokeRect(x + s / 2, y + s / 2, s, s);

			ctx.globalCompositeOperation = "color-dodge";
			ctx.strokeStyle = "rgb(106, 0, 255)";
			ctx.lineWidth = 3;

			if (moved) {
				ctx.lineTo(x + cellSize / 2, y + cellSize / 2);
			} else {
				ctx.moveTo(x + cellSize / 2, y + cellSize / 2);
				moved = true;
			}
		}
	}

	ctx.stroke();

	ctx.restore();
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
