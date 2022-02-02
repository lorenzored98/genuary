import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	const d = Math.sqrt(a * a + b * b);
	return d;
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 100;
	const padding = size / 6;
	const cellSize = (size - padding * 2) / cellCount;
	const peaks = 10;
	const maxDist = size / 4;
	const heightStep = 0.03;

	const padE = 1;

	const cells = [];

	for (let x = padding; x < size - padding - padE; x += cellSize) {
		const row = [];
		for (let y = padding; y < size - padding - padE; y += cellSize) {
			const cell = { x, y, weight: 0 };
			row.push(cell);
		}

		cells.push(row);
	}

	const algo = () => {
		const rowIndex = randomInRange(0, cellCount - 1);
		const colIndex = randomInRange(0, cellCount - 1);

		const cell = cells[rowIndex][colIndex];
		cell.weight = 1;

		for (let i = 0; i < cells.length; i++) {
			const row = cells[i];
			for (let j = 0; j < row.length; j++) {
				const targetCell = row[j];
				const d = dist(cell.x, cell.y, targetCell.x, targetCell.y);

				if (d > maxDist || d === 0) {
					continue;
				}

				const ratio = 1 - d / maxDist;
				targetCell.weight += Math.pow(1 * ratio, 2);
			}
		}
	};

	for (let i = 0; i < peaks; i++) {
		algo();
	}

	for (let i = 0; i < cells.length; i++) {
		const row = cells[i];
		for (let j = 0; j < row.length; j++) {
			const { x, y, weight } = row[j];

			ctx.fillStyle = `hsl(260, 100%, ${50 * weight}%)`;
			const h = Math.floor(weight / heightStep) + 1;

			ctx.save();
			ctx.translate(size / 2, size / 2 - padding);
			ctx.scale(1, 0.5);
			ctx.rotate((45 * Math.PI) / 180);

			ctx.beginPath();

			ctx.moveTo(x, y + cellSize);
			ctx.lineTo(x + cellSize, y + cellSize);
			ctx.lineTo(x + cellSize, y);

			ctx.lineTo(x - cellSize * (h - 1), y - cellSize * h);
			ctx.lineTo(x - cellSize * h, y - cellSize * h);
			ctx.lineTo(x - cellSize * h, y - cellSize * (h - 1));

			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			ctx.restore();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
