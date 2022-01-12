import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 100;
	const padding = size / 15;
	const cellSize = (size - padding * 2) / cellCount;

	const padE = 1;

	for (let x = padding; x < size - padding - padE; x += cellSize) {
		for (let y = padding; y < size - padding - padE; y += cellSize) {
			ctx.beginPath();
			const radius = (Math.random() * cellSize) / 2;

			ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);

			const alpha = Math.random().toFixed(3);
			ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;

			ctx.fill();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
