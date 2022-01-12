import { SquareCanvas } from "../shared/canvas2d";

/**
 * Idea
 * fare una grid sempre con
 * dentro la random value
 * per ogni random value fare un piccolo stirograph basandomi su quel valore li come qualcosa
 * i piccoli stirprgaoh poi sembreranno delle shape a loro volta ma e' una sola curva per figura
 *
 * devo anche giocare con il blending per alcuni.
 *
 */

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

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

	const cellCount = 8;
	const padding = size / 16;
	const cellSize = (size - padding * 2) / cellCount;

	const padE = 1;

	ctx.strokeStyle = "rgba(255, 200, 150, 0.15)";

	for (let x = padding; x < size - padding - padE; x += cellSize) {
		for (let y = padding; y < size - padding - padE; y += cellSize) {
			const r = cellSize / 2;
			const cx = x + r;
			const cy = y + r;

			const col1 = random(cx, cy, SEED);
			const col2 = random(x, y, SEED);

			ctx.lineJoin = "round";
			ctx.lineCap = "round";

			let radius1 = cellSize / (255 / col1);
			let radius2 = cellSize / (255 / col2);

			const maxScale = cellSize / 4;
			const scale = maxScale / Math.max(radius1, radius2);

			ctx.save();

			ctx.translate(cx, cy);
			ctx.scale(scale, scale);
			ctx.translate(-cx, -cy);

			ctx.beginPath();
			ctx.moveTo(cx + radius1 + radius2, cy);

			for (let theta = 0; theta <= Math.PI * 2; theta += 0.01) {
				const lineX =
					cx +
					radius1 * Math.cos(theta * col1) +
					radius2 * Math.cos(theta * col2);

				const lineY =
					cy +
					radius1 * Math.sin(theta * col1) +
					radius2 * Math.sin(theta * col2);

				ctx.lineTo(lineX, lineY);
			}

			ctx.stroke();
			ctx.restore();
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
