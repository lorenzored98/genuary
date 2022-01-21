import * as THREE from "three";
import vertShader from "./shader.vert?raw";
import fragShader from "./shader.frag?raw";

const main = document.querySelector("main");
const canvas = document.createElement("canvas");

main.appendChild(canvas);

let size = Math.min(window.innerWidth, window.innerHeight) - 100;

const scene = new THREE.Scene();

scene.background = new THREE.Color("rgb(35, 35, 39)");

let padding = size / 8;
let cellSize = size - padding * 2;

const geometry = new THREE.PlaneGeometry(1, 1);

const sourceMaterial = new THREE.RawShaderMaterial({
	vertexShader: vertShader,
	fragmentShader: fragShader,
});

const meshes = new THREE.Group();
scene.add(meshes);

const camera = new THREE.OrthographicCamera(
	-size / 2,
	size / 2,
	size / 2,
	-size / 2,
	0.1,
	1000
);
camera.position.z = 1;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(size.width, size.height);
renderer.setViewport(0, 0, size.width, size.height);

const clock = new THREE.Clock();

//
function draw() {
	const elapsedTime = clock.getElapsedTime();

	renderer.render(scene, camera);
	window.requestAnimationFrame(draw);
}

function resize() {
	size = Math.min(window.innerWidth, window.innerHeight);
	size -= 100;

	padding = size / 8;
	cellSize = size - padding * 2;

	// Update camera
	camera.left = -size / 2;
	camera.top = size / 2;
	camera.right = size / 2;
	camera.bottom = -size / 2;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(size, size);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	createMesh();
}

function createMesh() {
	for (const child of meshes.children) {
		meshes.remove(child);
	}

	const material = sourceMaterial.clone();

	const color = new THREE.Color("rgb(255, 196, 0)");
	// const color = new THREE.Color("rgb(255, 221, 107)");
	// const color = new THREE.Color("rgb(33, 33, 33)");

	material.uniforms.uColor = { value: color };

	const mesh = new THREE.Mesh(geometry, material);

	mesh.scale.set(cellSize, cellSize, 1);
	meshes.add(mesh);
}

window.addEventListener("resize", resize, { passive: true });

resize();

draw();
