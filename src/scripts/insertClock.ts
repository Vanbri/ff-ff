import { Mesh, Scene } from 'three';
import { Font, FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

let scene: Scene;
let mesh: Mesh | null = null;
let font: Font;

function updateText() {

	if (!mesh) throw new Error('No mesh');

	const now = new Date();
	const hh = String(now.getHours()).padStart(2, '0');
	const mm = String(now.getMinutes()).padStart(2, '0');
	const timeStr = `${hh}\n${mm}`;

	const geom = new TextGeometry(timeStr, {
		font: font,
		size: 0.2,
		depth: 0.1,
	});
	geom.computeBoundingBox();
	geom.center();

	mesh.geometry.dispose();
	mesh.geometry = geom;
}

let lastMinute: number | null = null;
function animate() {
	requestAnimationFrame(animate);
	const now = new Date();
	if (now.getMinutes() !== lastMinute) {
		lastMinute = now.getMinutes();
		updateText();
	}
}

export function insertClock(inputScene: Scene) {

	scene = inputScene;

	if (!scene.getObjectByName('TheClock')) return
	mesh = scene.getObjectByName('TheClock') as Mesh;

	new FontLoader().load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (inputFont) => {
		font = inputFont;
		updateText();
		animate();
	});
}
