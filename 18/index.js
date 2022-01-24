import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

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
	const SEED = Math.random();
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	const aspectRatio = 10.2 / 18.7;

	const padding = size / 8;

	const height = size - padding;
	const width = height * aspectRatio;
	const x = (size - width) / 2;
	const y = (size - height) / 2;

	const hue = Math.round(SEED * 360);
	const R = size / 10;
	const cellCount = size / 10;

	const pad = 20;

	ctx.fillStyle = "rgb(250, 249, 240)";
	ctx.fillRect(x, y, width, height);

	const getDrawableArea = () => {
		const x1 = x + pad;
		const y1 = y + size / 8;
		const x2 = x + width - pad;
		const y2 = y + height - size / 8;

		return { x1, y1, x2, y2 };
	};

	const getNormalizedDistance = (x1, y1, x2, y2) => {
		const area = getDrawableArea();
		const d = dist(x1, y1, x2, y2);
		const centerD = dist(area.x1, area.y1, area.x2, area.y2) / 2;

		return 1 - d / centerD;
	};

	const drawRects = () => {
		const { x1, x2, y1, y2 } = getDrawableArea();

		const rectsPad = 10;
		let rectY = y1;

		while (rectY < y2) {
			let h = randomInRange(20, 60);
			ctx.fillStyle = `hsl(${hue}, ${(h / 120) * 100}%, 50%)`;

			if (rectY + h > y2) {
				h = y2 - rectY;
				if (h < 5) h = 0;
			}

			ctx.fillRect(x1, rectY, x2 - x1, h);

			rectY += h + rectsPad;
		}
	};

	drawRects();

	const pattern = () => {
		const { x1, y1, x2, y2 } = getDrawableArea();

		const cellW = (x2 - x1) / cellCount;
		const cellH = (y2 - y1) / cellCount;

		const cells = [];
		for (let x = x1; x < x2 - 1; x += cellW) {
			for (let y = y1; y < y2 - 1; y += cellH) {
				const cx = x + cellW / 2;
				const cy = y + cellH / 2;

				cells.push({ cx, cy, filled: false });
			}
		}

		const cx = (x1 + x2) / 2;
		const cy = (y1 + y2) / 2;

		const lineX1 = randomInRange(x1, x1 + width / 4);
		const lineY1 = randomInRange(y1, y1 + height / 6);
		const lineX2 = x2 - (lineX1 - x1);
		const lineY2 = y2 - (lineY1 - y1);

		const slope = (lineY2 - lineY1) / (lineX2 - lineX1);

		let x = lineX1;
		let y = lineY1;

		const algo = () => {
			const power = getNormalizedDistance(x, y, cx, cy);

			const r = R * power;

			ctx.strokeStyle = "gray";
			ctx.lineWidth = 1;
			ctx.fillStyle = "rgb(250, 249, 240)";

			for (let i = 0; i < cells.length; i++) {
				const cell = cells[i];
				if (!cell.filled) {
					const d = dist(x, y, cell.cx, cell.cy);
					if (d < r) {
						ctx.fillRect(
							cell.cx - cellW / 2,
							cell.cy - cellH / 2,
							cellW,
							cellH
						);

						ctx.strokeRect(
							cell.cx - cellW / 2,
							cell.cy - cellH / 2,
							cellW,
							cellH
						);
						cell.filled = true;
					}
				}
			}

			const d = r / Math.sqrt(1 + slope * slope);
			x = x + d;
			y = y + slope * d;

			while (x < lineX2 && y < lineY2) {
				algo();
			}
		};

		algo();
	};

	pattern();

	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";

	// Logo
	ctx.textBaseline = "top";
	const vhs = "VHS";
	ctx.font = `${size / 12}px Staatliches`;
	const vhsM = ctx.measureText(vhs);
	ctx.fillText(vhs, x + pad + 5, y + pad + 5);

	ctx.lineWidth = 3;
	ctx.strokeRect(
		x + pad,
		y + pad,
		vhsM.width + 10,
		vhsM.actualBoundingBoxDescent + 10
	);

	// Bottom Text
	ctx.textBaseline = "bottom";
	const id = `E-${hue}`;
	ctx.font = `${size / 9}px Staatliches`;
	ctx.fillText(id, x + pad, y + height);

	const genuary = "#GENUARY2022";
	ctx.font = `${Math.max(size / 48, 12)}px Staatliches`;
	const gM = ctx.measureText(genuary);
	const gX = x + width - gM.width - pad;
	ctx.fillText(genuary, gX, y + height - pad);

	// Noise
	const imageData = ctx.getImageData(0, 0, size, size);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		const color = randomInRange(230, 255) / 255;

		data[i] *= color;
		data[i + 1] *= color;
		data[i + 2] *= color;
	}

	ctx.putImageData(imageData, 0, 0);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

const font = new FontFace("Staatliches", 'url("/Staatliches-Regular.ttf")');

font.load().then((f) => {
	document.fonts.add(f);
	draw();
});
