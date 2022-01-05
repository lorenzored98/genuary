import { debounce } from "./utils";

export class SquareCanvas {
	elem;
	ctx;
	dpr;
	size;
	draw;
	resizePadding;

	constructor({ debounceResize = 300, resizePadding = 100 }) {
		this.elem = document.createElement("canvas");
		this.ctx = this.elem.getContext("2d");
		this.dpr = window.devicePixelRatio;
		this.size = 0;
		this.resizePadding = resizePadding;

		this.resize();

		const debouncedResize = debounce(
			this.resize.bind(this),
			debounceResize
		);

		window.addEventListener("resize", debouncedResize, { passive: true });
	}

	resize() {
		this.dpr = window.devicePixelRatio;

		const min = Math.min(window.innerWidth, window.innerHeight);

		this.size = min - this.resizePadding;

		this.elem.width = this.size * this.dpr;
		this.elem.height = this.size * this.dpr;
		this.elem.style.width = `${this.size}px`;
		this.elem.style.height = `${this.size}px`;

		if (this.draw) {
			this.draw();
		}
	}
}
