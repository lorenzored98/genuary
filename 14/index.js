import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
};

const centerLine = (min, max, height) => {
	const center = (min + max) / 2;
	return {
		y1: center - height / 2,
		y2: center + height / 2,
	};
};

const algo = (height, falloff, i, maxHeight) => {
	let h = height;
	let v = Math.sin(falloff + i) * (falloff * 100) * Math.random();
	h += v;

	if (h < 0) h = maxHeight * falloff;
	if (h > maxHeight) h = maxHeight;
	return h;
};

const draw = () => {
	const SEED = Math.random();

	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	ctx.strokeStyle = "white";

	const rowCount = 7;
	const padding = size / 8;
	const cellH = (size - padding * 2) / rowCount;
	const cellW = size - padding * 2;

	const padE = 1;

	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.lineWidth = 4;

	const lineVertPad = cellH / 6;
	const lineHorizPad = 8;

	for (let y = padding; y < size - padding - padE; y += cellH) {
		let x = padding;

		const falloff = random(x, y, SEED);

		ctx.strokeStyle = `hsl(${falloff * 360}, 100%, 50%)`;

		let loop = true;
		let i = 0;
		const minY = y + lineVertPad;
		const maxY = y + cellH - lineVertPad;

		const maxHeight = maxY - minY;
		let lineHeight = maxHeight;

		while (loop) {
			const lineX = x + i * lineHorizPad;
			lineHeight = algo(lineHeight, falloff, i, maxHeight);

			const { y1, y2 } = centerLine(minY, maxY, lineHeight);

			ctx.beginPath();
			ctx.moveTo(lineX, y1);
			ctx.lineTo(lineX, y2);
			ctx.closePath();
			ctx.stroke();

			if (lineX >= x + cellW) {
				loop = false;
				break;
			}
			i++;
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
