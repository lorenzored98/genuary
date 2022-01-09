import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

let animFrame = 0;

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return Math.round(255 * f);
};

const draw = () => {
	window.cancelAnimationFrame(animFrame);
	const RAN_SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	const cellCount = 50;
	const padding = size / 6;
	const cellSize = (size - padding * 2) / cellCount;

	const padE = 1;

	const animation = () => {
		ctx.fillStyle = "rgb(35, 35, 39)";
		ctx.fillRect(0, 0, size, size);

		for (let x = padding; x < size - padding - padE; x += cellSize) {
			for (let y = padding; y < size - padding - padE; y += cellSize) {
				const r = cellSize / 2;
				const cx = x + r;
				const cy = y + r;

				const color = random(cx, cy, RAN_SEED);
				const height = color;
				ctx.save();

				const ms = performance.now() * 0.0001;
				const sinH = Math.sin((ms * height) / 2) * 2;
				ctx.lineWidth = canvas.dpr;
				ctx.strokeStyle = `rgba(100, 28, 255, ${sinH})`;

				ctx.translate(size / 2, sinH + size / 6);
				ctx.scale(1, 0.5);
				ctx.rotate((45 * Math.PI) / 180);
				ctx.strokeRect(x, y, cellSize, cellSize);
				ctx.restore();
			}
		}

		animFrame = window.requestAnimationFrame(animation);
	};

	animation();
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
