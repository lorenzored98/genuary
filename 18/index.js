/**
 * Creare la copertina dei vhs in modo generativo
 * voglio applicarci pure un film grain / white noise sopra.
 *
 * alcuni elementi possono esser
 * Lettera-{Power della cella} tipo E-255 A-6
 * C = cassette, E = extended
 * e questo e' tipo il seed della cover.
 *
 * cerchi con gradient un po steeped
 *
 * linee, grid, rettangoli ecc..
 *
 * https://uxdesign.cc/instagram-cant-touch-the-visual-glory-of-blank-vhs-tapes-8c165b683a1e
 *
 * posso usare la mia template della squareCanvas e semplicemente
 * avere il rect dentro che segua il giusto aspect ratio
 */

import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({ debounceResize: 0 });

const randomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const random = (x, y, seed) => {
	const dot = x * 12.9898 + y * 78.233 + seed;
	let f = Math.sin(dot) * 43758.5453123;
	f -= Math.floor(f);

	return f;
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

	const pad = 20;

	ctx.fillStyle = "rgb(250, 249, 240)";
	ctx.fillRect(x, y, width, height);

	const getDrawableArea = () => {
		const x1 = x + pad;
		const y1 = y + 100;
		const x2 = x + width - pad;
		const y2 = y + height - pad - 90;

		return { x1, y1, x2, y2 };
	};

	// Shapes

	// Horizontal rects w/ different height
	const drawRects = () => {
		const { x1, x2, y1, y2 } = getDrawableArea();

		const rectsPad = 10;
		let rectY = y1;

		while (rectY < y2) {
			let h = randomInRange(20, 60);
			ctx.fillStyle = `hsl(${(h / 60) * 360}, 100%, 50%)`;

			if (rectY + h > y2) {
				h = y2 - rectY;
				if (h < 5) h = 0;
			}

			ctx.fillRect(x1, rectY, x2 - x1, h);

			rectY += h + rectsPad;
		}
	};

	drawRects();

	// Cancel with a grid

	const drawGrid = () => {
		ctx.fillStyle = "rgb(250, 249, 240)";
		const { x1, y1, x2, y2 } = getDrawableArea();

		const cellCount = 10;
		const cellW = (x2 - x1) / cellCount;
		const cellH = (y2 - y1) / cellCount;

		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;

		const padE = 1;

		for (let x = x1; x < x2 - padE; x += cellW) {
			for (let y = y1; y < y2 - padE; y += cellH) {
				const power = random(x + cellW / 2, y + cellH / 2, SEED);
				if (power > 0.5) {
					ctx.fillRect(x - 1, y - 1, cellW + 2, cellH + 2);
				}
			}
		}
	};

	// drawGrid();

	ctx.fillStyle = "black";

	// Logo
	ctx.textBaseline = "top";
	const vhs = "VHS";
	ctx.font = "70px Staatliches";
	const vhsM = ctx.measureText(vhs);
	ctx.fillText(vhs, x + pad + 5, y + pad + 5);

	ctx.lineWidth = 3;
	ctx.strokeRect(x + pad, y + pad, vhsM.width + 10, 65);

	// Bottom Text
	ctx.textBaseline = "bottom";
	const id = `E-${Math.round(SEED * 255)}`;
	ctx.font = "95px Staatliches";
	ctx.fillText(id, x + pad, y + height);

	const genuary = "#GENUARY2022";
	ctx.font = "16px Staatliches";
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

draw();
