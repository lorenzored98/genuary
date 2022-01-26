import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	const d = Math.sqrt(a * a + b * b);
	return d;
};

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pointAtAngle = (p, d, angle) => {
	const x = p.x + d * Math.cos((angle * Math.PI) / 180);
	const y = p.y + d * Math.sin((angle * Math.PI) / 180);

	return { x, y };
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const hPointsCount = size / 4;
	const vPointsCount = size / 6;
	const variation = 8;
	const height = size / 2;

	const createShape = (p1, p2, orientation, offset) => {
		const shape = [];

		const hSlope = (p2.y - p1.y) / (p2.x - p1.x);

		const hStep = dist(p1.x, p1.y, p2.x, p2.y) / hPointsCount - offset;
		const hD = hStep / Math.sqrt(1 + hSlope * hSlope);

		let dX = p1.x;
		let dY = p1.y;

		for (let i = 0; i < hPointsCount + 1; i++) {
			const p1 = { x: dX, y: dY };
			const p2 = pointAtAngle(p1, height, hSlope, 135);

			const points = [];

			const vSlope = (p2.y - p1.y) / (p2.x - p1.x);
			const vStep = dist(p1.x, p1.y, p2.x, p2.y) / vPointsCount;
			const vD = vStep / Math.sqrt(1 + vSlope * vSlope);

			let vX = p1.x;
			let vY = p1.y;

			for (let j = 0; j < vPointsCount + 1; j++) {
				points.push({ x: vX, y: vY });

				vX = vX + vD * orientation;
				vY = vY + vSlope * vD * orientation;
			}

			dX = dX + hD;
			dY = dY + hSlope * hD;

			shape.push(points);
		}

		for (let i = 0; i < shape.length; i++) {
			const points = shape[i];

			for (let j = 0; j < points.length; j++) {
				points[j].y += randomInRange(-variation, variation);
			}
		}

		return shape;
	};

	const drawShape = (shape) => {
		for (let i = 0; i < shape.length; i++) {
			const points = shape[i];
			for (let j = 0; j < points.length; j++) {
				const { x, y } = points[j];

				let l = 50;
				l += randomInRange(-25, 100);
				ctx.fillStyle = `hsla(${215}, 100%, ${l}%, ${
					Math.cos(y) * 0.1
				})`;

				ctx.fillRect(x, y, 25, 25);
			}
		}
	};

	ctx.strokeStyle = "white";
	const p1 = { x: height / 2, y: 0 };
	const p2 = { x: size + height / 2, y: size };

	const shape1 = createShape(p1, p2, -1, 0);

	drawShape(shape1);

	const p3 = {
		x: shape1[0][shape1[0].length - 1].x,
		y: shape1[0][shape1[0].length - 1].y,
	};

	const p4 = {
		x: shape1[shape1.length - 1][shape1[shape1.length - 1].length - 1].x,
		y: shape1[shape1.length - 1][shape1[shape1.length - 1].length - 1].y,
	};

	const shape2 = createShape(p3, p4, 1, 0.25);
	drawShape(shape2);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
