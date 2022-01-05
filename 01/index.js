import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const draw = () => {
	const dprSize = canvas.size * canvas.dpr;

	canvas.ctx.fillStyle = "rgb(35, 35, 39)";
	canvas.ctx.fillRect(0, 0, dprSize, dprSize);

	const cellCount = 100;
	const cellSize = dprSize / cellCount;
	const padding = cellSize / 2;

	for (let i = 0; i < dprSize; i += cellSize) {
		for (let j = 0; j < dprSize; j += cellSize) {
			canvas.ctx.beginPath();
			const radius = (Math.random() * cellSize) / 2;
			const x = i + padding;
			const y = j + padding;
			canvas.ctx.arc(x, y, radius, 0, Math.PI * 2);

			const alpha = Math.random().toFixed(3);
			canvas.ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;

			canvas.ctx.fill();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
