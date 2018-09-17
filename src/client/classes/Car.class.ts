import * as THREE from 'three';
export class Car {
	constructor() {}
	createCar() {
		// wheels

		let bodyX: number = 0.3;
		let bodyY: number = 0.3;
		let bodyZ: number = 0.6;
		let car = new THREE.Group();
		let topGeo = new THREE.BoxGeometry(0.2, 0.3, 0.1);
		let bodyGeo = new THREE.BoxGeometry(bodyX, bodyY, bodyZ);
		var carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		var top = new THREE.Mesh(topGeo, carMaterial);
		var body = new THREE.Mesh(bodyGeo, carMaterial);
		let wheel_pos = this.wheel_places(bodyX, bodyY, bodyZ);
		let len: number = Object.keys(wheel_pos).length;
		for (let i = 0; i < len; i += 1) {
			let wheelGeo = new THREE.TorusGeometry(0.05, 0.025, 16, 100);
			let wheelMat = new THREE.MeshBasicMaterial({ color: 'black' });
			let wheel = new THREE.Mesh(wheelGeo, wheelMat);
			wheel.rotation.y = Math.PI / 2;
			console.log(wheel_pos);
			wheel.position.x = wheel_pos[String(i)].x;
			wheel.position.z = wheel_pos[String(i)].z;
			wheel.position.y = -0.14;
			car.add(wheel);
		}

		top.position.y = 0.25;
		car.add(body);
		car.add(top);

		return car;
	}
	wheel_places(x: number, y: number, z: number): { [key: string]: any } {
		return {
			'0': { x: -x / 2, z: z / 4 },
			'1': { x: x / 2, z: z / 4 },
			'2': { x: x / 2, z: -z / 4 },
			'3': { x: -x / 2, z: -z / 4 }
		};
	}
}