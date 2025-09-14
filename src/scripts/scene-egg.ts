import { Camera, Object3D, Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import gsap from "gsap";

export function onClickEgg(scene: Scene, camera: Camera, renderer: WebGLRenderer) {
	const raycaster = new Raycaster();
	const pointer = new Vector2();

	function findNamedAncestor(obj: Object3D | null, name: string): Object3D | null {
		let cur = obj;
		while (cur) {
			if (cur.name === name) return cur;
			cur = cur.parent;
		}
		return null;
	}

	function getPointerNormalized(event: PointerEvent) {
		const rect = renderer.domElement.getBoundingClientRect();
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
	}

	function onPointerDown(event: PointerEvent) {
		getPointerNormalized(event);
		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children, true);
		if (intersects.length === 0) return;

		const hit = intersects[0].object;
		const egg = findNamedAncestor(hit, "Egg");
		if (!egg) return;

		if ((egg.userData as any)._isAnimating) return;
		(egg.userData as any)._isAnimating = true;

		const originalZ = egg.rotation.z;
		const originalX = egg.rotation.x;

		const sign = Math.random() < 0.5 ? -1 : 1;
		const zMagnitude = (0.12 + Math.random() * 0.18) * sign;
		const xMagnitude = (0.03 + Math.random() * 0.05) * -sign;
		const duration = 0.10 + Math.random() * 0.10;

		gsap.to(egg.rotation, {
			z: originalZ + zMagnitude,
			x: originalX + xMagnitude,
			duration,
			ease: "power2.out",
			yoyo: true,
			repeat: 1,
			overwrite: true,
			onComplete: () => {
				egg.rotation.z = originalZ;
				egg.rotation.x = originalX;
				(egg.userData as any)._isAnimating = false;
			}
		});
	}

	renderer.domElement.addEventListener("pointerdown", onPointerDown);

	return () => {
		renderer.domElement.removeEventListener("pointerdown", onPointerDown);
	};
}
