// vite.config.js
const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				01: resolve(__dirname, "01/index.html"),
				02: resolve(__dirname, "02/index.html"),
				03: resolve(__dirname, "03/index.html"),
				04: resolve(__dirname, "04/index.html"),
			},
		},
	},
	server: {
		host: true,
	},
});
