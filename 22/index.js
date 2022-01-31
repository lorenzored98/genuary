import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

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
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const padding = size / 15;
	const yearPad = padding / 3;

	const createCircle = (cx, cy, rx, ry, reverse) => {
		ctx.beginPath();

		if (reverse) {
			for (let i = 0; i > -180; i--) {
				const angle = (i * Math.PI) / 180;
				const x = cx + Math.sin(angle) * rx;
				const y = cy + Math.cos(angle) * ry;
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
		} else {
			for (let i = 0; i < 180; i++) {
				const angle = (i * Math.PI) / 180;
				const x = cx + Math.sin(angle) * rx;
				const y = cy + Math.cos(angle) * ry;
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
		}

		ctx.closePath();
		ctx.stroke();
	};

	const algo = ({ x1, y1, x2, y2 }, year) => {
		ctx.strokeStyle = "white";
		const width = x2 - x1;
		const height = y2 - y1;

		ctx.globalCompositeOperation = "source-over";
		ctx.strokeRect(x1, y1, width, height);

		const s = Math.sin(year);
		const c = Math.cos(year);

		const cx = x1 + width / 2;
		const cy = y1 + height / 2;
		const maxD = dist(x1, y1, cx, cy);

		let reverse = false;

		ctx.globalCompositeOperation = "overlay";

		for (let k = 0; k < 20; k++) {
			for (let i = 0; i < 100; i++) {
				const x = x1 + (width / 100) * i;
				const y = y1 + (height / 100) * i;

				const d = dist(x, y, cx, cy);

				for (let j = 0; j < 2; j++) {
					let v = 1 - d / maxD;

					let hue = 45 * SEED;

					const l = randomInRange(50, 90);

					if (reverse) {
						hue += 170;
					}

					ctx.strokeStyle = `hsla(${hue}, ${
						100 * v * 1.2
					}%, ${l}%, ${0.25})`;

					v *= Math.random(0, d / maxD);

					const rx = 100 * s * v;
					const ry = 100 * c * v;

					createCircle(x, y, rx, ry, reverse);

					reverse = !reverse;
				}
			}
		}
	};

	const year = Math.floor(Date.now() / 3.154e10 + 1970);

	const current = {
		x1: padding,
		y1: padding,
		x2: size / 2 - yearPad,
		y2: size - padding,
	};

	const next = {
		x1: size / 2 + yearPad,
		y1: padding,
		x2: size - padding,
		y2: size - padding,
	};

	algo(current, year);
	algo(next, year + 1);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
