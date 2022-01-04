import { debounce } from "../shared/utils";

const main = document.querySelector("main");
const canvas = document.createElement("canvas");
main.appendChild(canvas);

let size = 0;
let dpr = window.devicePixelRatio;

const ctx = canvas.getContext("2d");

const draw = () => {
	const dprSize = size * dpr;

	ctx.fillStyle = "rgb(35, 35, 39)";
	ctx.fillRect(0, 0, dprSize, dprSize);

	const cellCount = 100;
	const cellSize = dprSize / cellCount;
	const padding = cellSize / 2;

	console.log(cellSize, padding);

	for (let i = 0; i < dprSize; i += cellSize) {
		for (let j = 0; j < dprSize; j += cellSize) {
			ctx.beginPath();
			const radius = (Math.random() * cellSize) / 2;
			const x = i + padding;
			const y = j + padding;
			ctx.arc(x, y, radius, 0, Math.PI * 2);

			const alpha = Math.random().toFixed(3);
			ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;

			ctx.fill();
		}
	}
};

const resize = () => {
	dpr = window.devicePixelRatio;

	const min = Math.min(window.innerWidth, window.innerHeight);

	size = min - 100;

	canvas.width = size * dpr;
	canvas.height = size * dpr;
	canvas.style.width = `${size}px`;
	canvas.style.height = `${size}px`;

	draw();
};

resize();

const debouncedResize = debounce(resize, 300);

window.addEventListener("resize", debouncedResize, { passive: true });
