import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 100;
	const cellSize = size / cellCount;
	const padding = cellSize / 2;

	for (let i = 0; i < size; i += cellSize) {
		for (let j = 0; j < size; j += cellSize) {
			ctx.beginPath();
			const radius = (Math.random() * cellSize) / 2;
			const x = i + padding;
			const y = j + padding;
			ctx.arc(x, y, radius, 0, Math.PI * 2);

			const alpha = Math.random().toFixed(3);
			ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;

			ctx.fill();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
