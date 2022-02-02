import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomInRangeDecimal = (min, max) => {
	return Math.random() * (max - min + 1) + min;
};

const calcCentroid = (points) => {
	const centroid = { x: 0, y: 0 };
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		centroid.x += point.x;
		centroid.y += point.y;
	}

	centroid.x /= points.length;
	centroid.y /= points.length;

	return centroid;
};

const draw = () => {
	const ctx = canvas.ctx;
	const canvasSize = canvas.size;

	const BG_COL = "rgb(35,35,39)";

	ctx.fillStyle = BG_COL;
	ctx.fillRect(0, 0, canvasSize, canvasSize);

	const cellCount = 2;
	const padding = canvasSize / 8;
	const cellSize = (canvasSize - padding * 2) / cellCount;
	const shapeSegments = [3, 4, 5, 6, 7, 8, 9];

	const padE = 1;

	const createShape = (x, y, size, segments) => {
		const segWidth = size / 2;
		const centerEmpty = size / randomInRange(12, 20);
		const p2Size = 8;

		const stemR = centerEmpty * Math.sqrt(2);
		const cellCount = 80;
		const cellSize = (stemR * 2) / cellCount;

		const cx = x + size / 2;
		const cy = y + size / 2;

		const stemBounds = {
			x1: cx - stemR,
			y1: cy - stemR,
			x2: cx + stemR,
			y2: cy + stemR,
		};

		const stemColorStart = "white";
		const stemColorEnd = `hsl(${Math.random() * 360}, 100%, 50%)`;

		const hue = randomInRange(60, 120);

		const petalColorStart = `hsl(${hue}, 100%, 50%)`;
		const petalColorEnd = `hsl(${360 - hue}, 100%, 50%)`;

		const stemGradient = ctx.createRadialGradient(
			cx,
			cy,
			0,
			cx,
			cy,
			centerEmpty
		);

		stemGradient.addColorStop(0, stemColorStart);
		stemGradient.addColorStop(1, stemColorEnd);

		for (let x = stemBounds.x1; x < stemBounds.x2; x += cellSize) {
			for (let y = stemBounds.y1; y < stemBounds.y2; y += cellSize) {
				ctx.fillStyle = stemGradient;
				ctx.fillRect(x, y, cellSize, cellSize);
			}
		}

		const petalGradient = ctx.createRadialGradient(
			cx,
			cy,
			segWidth / 4,
			cx,
			cy,
			segWidth
		);

		petalGradient.addColorStop(0, petalColorStart);
		petalGradient.addColorStop(1, petalColorEnd);

		for (let i = 1; i <= segments; i += 1) {
			let j = i + 1;
			if (j > segments) {
				j = 1;
			}

			const iStep = (i * 2 * Math.PI) / segments;
			const jStep = (j * 2 * Math.PI) / segments;

			let x1 = cx + centerEmpty * Math.cos(iStep);
			let y1 = cy + centerEmpty * Math.sin(iStep);

			let x2 = cx + segWidth * Math.cos(iStep);
			let y2 = cy + segWidth * Math.sin(iStep);

			let x3 = cx + segWidth * Math.cos(jStep);
			let y3 = cy + segWidth * Math.sin(jStep);

			let x4 = cx + centerEmpty * Math.cos(jStep);
			let y4 = cy + centerEmpty * Math.sin(jStep);

			const centroid = calcCentroid([
				{ x: x1, y: y1 },
				{ x: x2, y: y2 },
				{ x: x3, y: y3 },
				{ x: x4, y: y4 },
			]);

			ctx.save();

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x4, y4);
			ctx.closePath();

			ctx.fillStyle = BG_COL;
			ctx.fill();

			ctx.translate(centroid.x, centroid.y);
			ctx.scale(0.9, 0.9);
			ctx.translate(-centroid.x, -centroid.y);

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x4, y4);
			ctx.closePath();

			ctx.fillStyle = petalGradient;
			ctx.fill();

			for (let k = centerEmpty + p2Size * 2; k < segWidth; k++) {
				for (let l = 0; l < 10; l++) {
					const displace = i + randomInRangeDecimal(2, 7) / 10;

					const step = (displace * 2 * Math.PI) / segments;
					const x = cx + k * Math.cos(step);
					const y = cy + k * Math.sin(step);

					ctx.fillStyle = BG_COL;
					ctx.beginPath();
					ctx.arc(x, y, p2Size, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			ctx.restore();
		}

		const imageData = ctx.getImageData(x, y, size, size);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			const color = randomInRange(230, 255) / 255;

			data[i] *= color;
			data[i + 1] *= color;
			data[i + 2] *= color;
		}

		ctx.putImageData(imageData, x, y);
	};

	for (let y = padding; y < canvasSize - padding - padE; y += cellSize) {
		for (let x = padding; x < canvasSize - padding - padE; x += cellSize) {
			const i = randomInRange(0, shapeSegments.length - 1);
			createShape(x, y, cellSize, shapeSegments[i]);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x, y, cellSize, cellSize);
			shapeSegments.splice(i, 1);
		}
	}

	ctx.strokeStyle = "white";
	ctx.strokeRect(
		padding,
		padding,
		canvasSize - padding * 2,
		canvasSize - padding * 2
	);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
