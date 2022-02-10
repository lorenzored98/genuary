import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

const lerp = (p0, p1, t) => {
	return {
		x: p0.x * (1 - t) + p1.x * t,
		y: p0.y * (1 - t) + p1.y * t,
	};
};

const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	const d = Math.sqrt(a * a + b * b);
	return d;
};

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35,35,39)";
	ctx.fillRect(0, 0, size, size);

	const padding = size / 4;
	const pointsCount = 50;
	const lineCount = 50;
	const linePad = (size - padding * 2) / lineCount;
	const hStep = size / 50;

	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.globalCompositeOperation = "overlay";

	for (let h = 0; h < padding + padding / 2; h += hStep) {
		const cx = size / 2;
		const cy = size / 2;
		const r = randomInRange(size / 10, size / 8);
		const pullR = randomInRange(r, r * 1.5);

		ctx.save();
		ctx.translate(size / 2, h);
		ctx.scale(1, 0.5);
		ctx.rotate((45 * Math.PI) / 180);

		const points = [];

		for (let x = padding; x <= size - padding; x += linePad) {
			const p1 = {
				x,
				y: padding,
			};
			const p2 = { x: x, y: size - padding };

			const column = [];

			for (let i = 0; i <= pointsCount; i++) {
				const p = lerp(p1, p2, i / pointsCount);
				column.push(p);
			}
			points.push(column);
		}

		for (let i = 0; i < points.length; i++) {
			const col = points[i];

			ctx.beginPath();
			ctx.moveTo(col[0].x, col[0].y);

			let hit = false;

			for (let j = 1; j < col.length; j++) {
				let p = col[j];
				const d = dist(p.x, p.y, cx, cy);

				if (hit === false) {
					if (d < pullR) {
						hit = true;
						ctx.stroke();
						ctx.beginPath();
						continue;
					}

					ctx.lineTo(p.x, p.y);
				} else {
					if (d > pullR) {
						ctx.moveTo(p.x, p.y);
						hit = false;
					}
				}
			}

			ctx.stroke();
		}

		ctx.restore();
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
