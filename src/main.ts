import { ObjectLoader, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { insertClock } from './scripts/insertClock';

let w = window.innerWidth;
let h = window.innerHeight;

let scene: Scene;
let camera: PerspectiveCamera;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new ObjectLoader();
loader.load('./scenes/Egg.json', (loadedScene) => {
	scene = loadedScene as Scene;
	camera = scene.getObjectByName('MainCamera') as PerspectiveCamera;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	insertClock(scene);

	animate();
});

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
	w = window.innerWidth;
	h = window.innerHeight;
	renderer.setSize(w, h);
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
});

let isDragging = false;
let prevMouseX = 0;

window.addEventListener('mousedown', (e) => {
	isDragging = true;
	prevMouseX = e.clientX;
});

window.addEventListener('mouseup', () => {
	isDragging = false;
});

window.addEventListener('mousemove', (e) => {
	if (!isDragging) return;

	const deltaX = e.clientX - prevMouseX;
	prevMouseX = e.clientX;

	const sensitivity = 0.002;
	if (camera) {
		camera.position.x -= deltaX * sensitivity;
	}
});

let prevTouchX = 0;

window.addEventListener('touchstart', (e) => {
	if (e.touches.length === 1) {
		prevTouchX = e.touches[0].clientX;
		isDragging = true;
	}
});

window.addEventListener('touchend', () => {
	isDragging = false;
});

window.addEventListener('touchmove', (e) => {
	if (!isDragging || e.touches.length !== 1) return;

	const touchX = e.touches[0].clientX;
	const deltaX = touchX - prevTouchX;
	prevTouchX = touchX;

	const sensitivity = 0.004;
	if (camera) {
		camera.position.x -= deltaX * sensitivity;
	}
});
