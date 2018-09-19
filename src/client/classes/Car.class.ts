import * as THREE from 'three';
export class Car {
	constructor() {}
	createCar() {
		let bodyX: number = 0.3;
		let bodyY: number = 0.2;
		let bodyZ: number = 0.6;
		let car = new THREE.Group();
		let topGeo = new THREE.CylinderGeometry(1.2 / Math.sqrt(2), 1.5 / Math.sqrt(2), 0.75, 4, 1); // size of top can be changed
		let bodyGeo = new THREE.BoxGeometry(bodyX, bodyY, bodyZ);
		var carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		topGeo.computeFlatVertexNormals();
		var top = new THREE.Mesh(topGeo, carMaterial);
		var body = new THREE.Mesh(bodyGeo, carMaterial);
		let wheel_pos = this.wheel_places(bodyX, bodyY, bodyZ);
		let len: number = Object.keys(wheel_pos).length;

		// wheels
		for (let i = 0; i < len; i += 1) {
			let wheelGeo = new THREE.TorusGeometry(0.05, 0.025, 16, 100);
			let wheelMat = new THREE.MeshBasicMaterial({ color: 'black' });
			let wheel = new THREE.Mesh(wheelGeo, wheelMat);
			wheel.rotation.y = Math.PI / 2;
			wheel.position.x = wheel_pos[i].x;
			wheel.position.z = wheel_pos[i].z;
			wheel.position.y = -0.12;
			car.add(wheel);
		}
		// bumpers
		for (let i = 0; i < 2; i += 1) {
			let bumperGeo = new THREE.BoxGeometry(0.32, 0.05, 0.02);
			let material = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.5 });
			let bumper = new THREE.Mesh(bumperGeo, material);
			if (i === 0) {
				bumper.position.z = bodyZ / 2;
			} else {
				bumper.position.z = -bodyZ / 2;
			}
			bumper.position.y = -bodyY / 2.6;
			car.add(bumper);
		}
		top.scale.set(0.2, 0.2, 0.2);
		top.rotation.y = Math.PI / 4;
		top.position.y = 0.175;
		top.position.z = 0.05;
		car.add(body);
		car.add(top);
		return car;
	}
	wheel_places(x: number, y: number, z: number): Array<{ x: number; z: number }> {
		return [{ x: -x / 2, z: z / 4 }, { x: x / 2, z: z / 4 }, { x: x / 2, z: -z / 4 }, { x: -x / 2, z: -z / 4 }];
	}
}
