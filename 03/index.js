import * as THREE from "three";
import vertShader from "./shader.vert?raw";
import fragShader from "./shader.frag?raw";

const main = document.querySelector("main");
const canvas = document.createElement("canvas");

main.appendChild(canvas);

let size = 0;

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2),
	new THREE.RawShaderMaterial({
		vertexShader: vertShader,
		fragmentShader: fragShader,
		uniforms: {
			uTime: { value: 0 },
		},
	})
);

scene.add(mesh);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(size, size);
renderer.setViewport(0, 0, size, size);

const clock = new THREE.Clock();

//
function draw() {
	const elapsedTime = clock.getElapsedTime();

	mesh.material.uniforms.uTime.value = elapsedTime;

	renderer.render(scene, camera);
	window.requestAnimationFrame(draw);
}

function resize() {
	size = Math.min(window.innerWidth, window.innerHeight);

	size -= 100;

	// Update camera
	camera.left = -1;
	camera.top = 1;
	camera.right = 1;
	camera.bottom = -1;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(size, size);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", resize, { passive: true });

resize();

draw();
