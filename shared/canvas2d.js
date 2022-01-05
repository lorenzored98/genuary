import { debounce } from "./utils";

export class SquareCanvas {
	elem;
	ctx;
	dpr;
	cssSize;
	size;
	draw;
	resizePadding;

	constructor({ debounceResize = 300, resizePadding = 100 }) {
		this.elem = document.createElement("canvas");
		this.ctx = this.elem.getContext("2d");
		this.dpr = window.devicePixelRatio;
		this.cssSize = 0;
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

		this.cssSize = min - this.resizePadding;
		this.size = this.cssSize * this.dpr;

		this.elem.width = this.size;
		this.elem.height = this.size;
		this.elem.style.width = `${this.cssSize}px`;
		this.elem.style.height = `${this.cssSize}px`;

		if (this.draw) {
			this.draw();
		}
	}
}
