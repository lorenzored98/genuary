import { SquareCanvas } from "../shared/canvas2d";

const main = document.querySelector("main");
const canvas = new SquareCanvas({});

const createGradient = (ctx, x, y, width, height) => {
	const gradient = ctx.createLinearGradient(x, y, width, height);

	gradient.addColorStop(0, `rgb(${135}, ${155}, ${255})`);
	gradient.addColorStop(1, `rgb(${183}, ${135}, ${255})`);

	return gradient;
};

// Pseudocode from Floyd–Steinberg dithering wikipedia
// Probably did something wrong but looks cool anyway
const dither = (data, rowSize, pad, randArr) => {
	for (let i = 0; i < data.length; i += pad) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];

		const rand = randArr[i];
		const newPixel = [r * rand, g * rand, b * rand, a];

		data[i] = newPixel[0];
		data[i + 1] = newPixel[1];
		data[i + 2] = newPixel[2];
		data[i + 3] = newPixel[3];

		const quantError = [
			r - newPixel[0],
			g - newPixel[1],
			b - newPixel[2],
			a - newPixel[3],
		];

		const diff = 7 / 16;
		data[i + 4] = data[i + 4] + quantError[0] * diff;
		data[i + 5] = data[i + 5] + quantError[1] * diff;
		data[i + 6] = data[i + 6] + quantError[2] * diff;
		data[i + 7] = data[i + 7] + quantError[3] * diff;

		let j = i;

		j += rowSize;
		j -= 4;

		for (let k = 0; k < 3; k++) {
			let diff;
			if (k === 0) {
				diff = 3 / 16;
			} else if (k === 1) {
				diff = 5 / 16;
			} else if (k === 2) {
				diff = 1 / 16;
			}

			data[j + 0] = data[j + 0] + quantError[0] * diff;
			data[j + 1] = data[j + 1] + quantError[1] * diff;
			data[j + 2] = data[j + 2] + quantError[2] * diff;
			data[j + 3] = data[j + 3] + quantError[3] * diff;

			j += 4;
		}
	}
};

const ditherRect = (x, y, width, height, ctx, pad, randArr) => {
	const gradient = createGradient(ctx, x, y, width, height);
	ctx.fillStyle = gradient;
	ctx.fillRect(x, y, width, height);

	const imageData = ctx.getImageData(x, y, width, height);
	const data = imageData.data;

	dither(data, width, pad, randArr);

	ctx.putImageData(imageData, x, y);
};

const draw = () => {
	const ctx = canvas.ctx;
	const size = canvas.size;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, size, size);

	// Layout 6 rects w/ padding between them and between borders
	const padding = 20;
	const width = Math.round((size - padding * 4) / 3);
	const height = Math.round((size - padding * 3) / 2);

	// So that every dither pixel will have same random across all rects
	const randArr = new Array(width * height * 4);
	for (let i = 0; i < randArr.length; i++) {
		randArr[i] = Math.random();
	}

	const gradient = createGradient(ctx, padding, padding, width, height);
	ctx.fillStyle = gradient;
	ctx.fillRect(padding, padding, width, height);

	ditherRect(width + padding * 2, padding, width, height, ctx, 32, randArr);

	ditherRect(
		width * 2 + padding * 3,
		padding,
		width,
		height,
		ctx,
		16,
		randArr
	);

	ditherRect(padding, padding * 2 + height, width, height, ctx, 12, randArr);

	ditherRect(
		width + padding * 2,
		padding * 2 + height,
		width,
		height,
		ctx,
		8,
		randArr
	);
	ditherRect(
		width * 2 + padding * 3,
		padding * 2 + height,
		width,
		height,
		ctx,
		6,
		randArr
	);
};

canvas.draw = draw;

main.appendChild(canvas.elem);

draw();
