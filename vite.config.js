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
				05: resolve(__dirname, "05/index.html"),
				06: resolve(__dirname, "06/index.html"),
				07: resolve(__dirname, "07/index.html"),
				08: resolve(__dirname, "08/index.html"),
				09: resolve(__dirname, "09/index.html"),
				10: resolve(__dirname, "10/index.html"),
				12: resolve(__dirname, "12/index.html"),
				13: resolve(__dirname, "13/index.html"),
				14: resolve(__dirname, "14/index.html"),
				15: resolve(__dirname, "15/index.html"),
				16: resolve(__dirname, "16/index.html"),
				17: resolve(__dirname, "17/index.html"),
				18: resolve(__dirname, "18/index.html"),
				19: resolve(__dirname, "19/index.html"),
				20: resolve(__dirname, "20/index.html"),
				21: resolve(__dirname, "21/index.html"),
				22: resolve(__dirname, "22/index.html"),
			},
		},
	},
	server: {
		host: true,
	},
});
