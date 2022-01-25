import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const chars = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
];

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;

	const d = Math.sqrt(a * a + b * b);
	return d;
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const cellCount = 6;
	const padding = size / 8;
	const cellW = Math.round((size - padding * 2) / cellCount);
	const cellH = Math.round((size - padding * 2) / cellCount);

	const numPoints = 400;
	const rectSize = size / 90;

	ctx.textBaseline = "top";
	ctx.font = `${size / 6 - size / 24}px Staatliches`;

	let imageData = null;

	const sampleRandomPixel = (cellX, cellY) => {
		const x = randomInRange(0, cellW);
		const y = randomInRange(0, cellH);

		const i = y * cellW * 4 + x * 4;

		let color = 0;
		color += imageData.data[i];
		color += imageData.data[i + 1];
		color += imageData.data[i + 2];

		if (color === 600) {
			return { x: x + cellX, y: y + cellY };
		}

		return null;
	};

	for (let y = padding; y < size - padding - cellH / 2; y += cellH) {
		for (let x = padding; x < size - padding - cellW / 2; x += cellW) {
			const points = [];

			let maxDist = 0;

			const i =
				Math.round((y - padding) / cellH) * cellCount +
				Math.round(x / cellW) -
				1;

			if (i < chars.length) {
				const char = chars[i];
				const m = ctx.measureText(char);
				const charX = (x + x + cellW) / 2 - m.width / 2;
				const charY = y + (cellH - m.actualBoundingBoxDescent) / 2;

				maxDist = Math.sqrt(
					Math.pow(m.width, 2) +
						Math.pow(m.actualBoundingBoxDescent, 2)
				);

				ctx.fillStyle = "rgb(200, 200, 200)";
				ctx.fillText(char, charX, charY);

				imageData = ctx.getImageData(x, y, cellW, cellH);

				let k = numPoints;
				while (k > 0) {
					const p = sampleRandomPixel(x, y);
					if (p) {
						points.push(p);
					}

					k--;
				}
			}

			ctx.fillStyle = "rgb(35, 35, 39)";
			ctx.fillRect(x, y, cellW, cellH);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x, y, cellW, cellH);

			if (!points.length) continue;

			let p = points[0];

			for (let i = 0; i < points.length; i++) {
				const point = points[i];
				const d = dist(p.x, p.y, point.x, point.y);

				const a = 1 - d / maxDist;

				ctx.fillStyle = `rgba(126, 66, 245, ${a})`;
				ctx.fillRect(
					point.x - rectSize / 2,
					point.y - rectSize / 2,
					rectSize,
					rectSize
				);

				p = point;
			}
		}
	}
};

canvas.draw = draw;

main.appendChild(canvas.elem);

const font = new FontFace("Staatliches", 'url("/Staatliches-Regular.ttf")');

font.load().then((f) => {
	document.fonts.add(f);
	draw();
});
