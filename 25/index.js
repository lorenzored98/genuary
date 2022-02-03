import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

const rotateX = (p, angle) => {
	const radians = (angle * Math.PI) / 180;
	const s = Math.sin(radians);
	const c = Math.cos(radians);

	return {
		x: p.x,
		y: c * p.y - s * p.z,
		z: s * p.y + c * p.z,
	};
};

const rotateY = (p, angle) => {
	const radians = (angle * Math.PI) / 180;
	const s = Math.sin(radians);
	const c = Math.cos(radians);

	return {
		x: c * p.x - s * p.z,
		y: p.y,
		z: s * p.x + c * p.z,
	};
};

const isInside = (p, { x1, x2, y1, y2 }) => {
	if (p.x < x1 || p.x > x2 || p.y < y1 || p.y > y2) {
		return false;
	}

	return true;
};

// Credit: Manfred Mohr P-197

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 6;
	const padding = size / 8;
	const cellSize = (size - padding * 2) / cellCount;
	const cellPad = cellSize / 20;

	const cubeSize = cellSize / 2 - cellPad;

	for (let i = 1; i < cellCount; i++) {
		ctx.strokeStyle = "white";
		const coord = padding + cellSize * i;

		ctx.beginPath();
		ctx.moveTo(coord, padding);
		ctx.lineTo(coord, size - padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(padding, coord);
		ctx.lineTo(size - padding, coord);
		ctx.stroke();
	}

	const algo = (cx, cy, bounds, side) => {
		const modelToView = (p) => {
			return {
				x: (p.x + 0.5) * cubeSize + cx,
				y: (p.y + 0.5) * cubeSize + cy - cubeSize / 2,
			};
		};

		// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
		const intersects = (p1, p2) => {
			const { y1, y2 } = bounds;

			const x1 = side === "l" ? bounds.x2 : bounds.x1;
			const x2 = side === "l" ? bounds.x2 : bounds.x1;

			if (p1.x === p2.x && p1.y === p2.y) {
				return null;
			}

			const denominator =
				(p2.y - p1.y) * (x2 - x1) - (p2.x - p1.x) * (y2 - y1);

			// Lines are parallel
			if (denominator === 0) {
				return null;
			}

			const ua =
				((p2.x - p1.x) * (y1 - p1.y) - (p2.y - p1.y) * (x1 - p1.x)) /
				denominator;

			const ub =
				((x2 - x1) * (y1 - p1.y) - (y2 - y1) * (x1 - p1.x)) /
				denominator;

			// is the intersection along the segments
			if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
				return null;
			}

			// Return a object with the x and y coordinates of the intersection
			const x = x1 + ua * (x2 - x1);
			const y = y1 + ua * (y2 - y1);

			return { x, y };
		};

		const connectPoints = (point1, point2) => {
			const p1 = modelToView(point1);
			const p2 = modelToView(point2);

			const p1Inside = isInside(p1, bounds);
			const p2Inside = isInside(p2, bounds);

			// ctx.beginPath();
			// ctx.moveTo(p1.x, p1.y);
			// ctx.lineTo(p2.x, p2.y);
			// ctx.stroke();

			if (p1Inside && p2Inside) {
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			} else if (p1Inside && !p2Inside) {
				// Find intersection and draw that
				const i = intersects(p1, p2);
				if (i) {
					ctx.beginPath();
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(i.x, i.y);
					ctx.stroke();
				}
			} else if (!p1Inside && p2Inside) {
				const i = intersects(p2, p1);
				if (i) {
					ctx.beginPath();
					ctx.moveTo(p2.x, p2.y);
					ctx.lineTo(i.x, i.y);
					ctx.stroke();
				}
			}
		};

		const points = [
			{ x: -0.5, y: -0.5, z: -0.5 },
			{ x: -0.5, y: -0.5, z: 0.5 },
			{ x: -0.5, y: 0.5, z: -0.5 },
			{ x: -0.5, y: 0.5, z: 0.5 },
			{ x: 0.5, y: -0.5, z: -0.5 },
			{ x: 0.5, y: -0.5, z: 0.5 },
			{ x: 0.5, y: 0.5, z: -0.5 },
			{ x: 0.5, y: 0.5, z: 0.5 },
		];

		const rx = Math.random() * 180;
		const ry = Math.random() * 180;

		for (var i = 0; i < points.length; ++i) {
			points[i] = rotateY(points[i], rx);
			points[i] = rotateX(points[i], ry);
		}

		ctx.strokeStyle = "rgb(107, 3, 252)";
		ctx.lineWidth = 2;
		connectPoints(points[0], points[2]);
		connectPoints(points[0], points[1]);
		connectPoints(points[0], points[4]);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgb(164, 97, 255)";
		connectPoints(points[1], points[3]);
		connectPoints(points[1], points[5]);
		connectPoints(points[2], points[3]);
		connectPoints(points[2], points[6]);
		connectPoints(points[4], points[5]);
		connectPoints(points[4], points[6]);

		ctx.strokeStyle = "rgb(196, 153, 255)";
		ctx.lineWidth = 1;
		connectPoints(points[7], points[3]);
		connectPoints(points[7], points[5]);
		connectPoints(points[7], points[6]);
	};

	for (
		let y = padding + cellSize;
		y < size - padding - cellSize / 2;
		y += cellSize
	) {
		for (
			let x = padding + cellSize;
			x < size - padding - cellSize / 2;
			x += cellSize
		) {
			const leftBounds = {
				x1: x - cellSize / 2 + cellPad,
				y1: y - cellSize / 2 + cellPad,
				x2: x,
				y2: y + cellSize / 2 - cellPad,
			};

			const rightBounds = {
				x1: x,
				y1: y - cellSize / 2 + cellPad,
				x2: x + cellSize / 2 - cellPad,
				y2: y + cellSize / 2 - cellPad,
			};

			const cx = (leftBounds.x1 + leftBounds.x2) / 2;
			const cy = (leftBounds.y1 + leftBounds.y2) / 2;

			algo(cx, cy, leftBounds, "l");
			algo(cx, cy, rightBounds, "r");
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
