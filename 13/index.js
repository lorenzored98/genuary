import * as THREE from "three";
import vertShader from "./shader.vert?raw";
import fragShader from "./shader.frag?raw";

const main = document.querySelector("main");
const canvas = document.createElement("canvas");

main.appendChild(canvas);

const size = {
	width: 800,
	height: 80,
};

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2),
	new THREE.RawShaderMaterial({
		vertexShader: vertShader,
		fragmentShader: fragShader,
		uniforms: {
			uTime: { value: 0 },
			uRes: { value: { x: 0, y: 0 } },
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
renderer.setSize(size.width, size.height);
renderer.setViewport(0, 0, size.width, size.height);

const clock = new THREE.Clock();

//
function draw() {
	const elapsedTime = clock.getElapsedTime();

	mesh.material.uniforms.uTime.value = elapsedTime;

	renderer.render(scene, camera);
	window.requestAnimationFrame(draw);
}

function resize() {
	let w = Math.min(window.innerWidth, window.innerHeight);
	w -= 100;

	w = Math.min(w, 800);

	size.width = w;
	size.height = w * 0.1;

	// Update camera
	camera.left = -1;
	camera.top = 1;
	camera.right = 1;
	camera.bottom = -1;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	mesh.material.uniforms.uRes.value = { x: size.width, y: size.height };
}

window.addEventListener("resize", resize, { passive: true });

resize();

draw();
