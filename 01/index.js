const canvas = document.getElementById("canvas");
const { width, height } = canvas.getBoundingClientRect();

const dpr = Math.min(window.devicePixelRatio, 2);

canvas.width = width * dpr;
canvas.height = height * dpr;

const ctx = canvas.getContext("2d");
