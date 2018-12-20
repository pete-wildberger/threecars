import * as THREE from 'three';
export class Elf {
	createElf() {
        let elf = new THREE.Group();
		const skin = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // 
		const bodyGeo = new THREE.CylinderGeometry( .25, .25, .25, 32 ); // size of top can be changed
		const bodyMat = new THREE.MeshBasicMaterial( { color: 'rgb(20, 107, 58)' } );
        const body = new THREE.Mesh(bodyGeo, bodyMat);
		
        // bodyGeo.computeFlatVertexNormals();
        // head
		let head = new THREE.Group();

        const headGeo = new THREE.SphereGeometry(.25,32,32 ); // size of top can be changed
        const headMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const face = new THREE.Mesh(headGeo, headMaterial);
		head.add(face)
		for (let i = 0; i < 2; i++) {
			var geom = new THREE.Geometry();
			if(i ===0 ){
			
			var v1 = new THREE.Vector3(0,0,0);
			var v2 = new THREE.Vector3(0,.06,0);
			var v3 = new THREE.Vector3(-.1,.1,0);
			} else {
			var v1 = new THREE.Vector3(0,0,0);
			var v2 = new THREE.Vector3(.1,.1,0);
			var v3 = new THREE.Vector3(0,.06,0);
			}
			geom.vertices.push(v1);
			geom.vertices.push(v2);
			geom.vertices.push(v3);

			geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
			geom.computeFaceNormals();

			var ear = new THREE.Mesh( geom, skin );
			if(i ===0 ){
			ear.position.set(-.25,-.05,0)
			} else {
			ear.position.set(.25,-.05,0)
			}
			head.add(ear)
		}
		
		head.position.set( 0, .333, 0 );
        // // hat
        const hatGeo = new THREE.ConeGeometry(.325,.5,32 ); // size of top can be changed
        const hatMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(20, 107, 58)' } );
        const hat = new THREE.Mesh(hatGeo, hatMaterial);
		hat.position.set( 0, .625, 0 );

		// arms
		for (let i = 0; i < 2; i++) {
			let arm = new THREE.Group();
			const armGeo = new THREE.CylinderGeometry( .075, .075, .22, 32 ); // size of top can be changed
        	const armMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(20, 107, 58)' } );
        	const notHand = new THREE.Mesh(armGeo, armMaterial);

			const handGeo = new THREE.SphereGeometry(.075,32,32 ); // size of top can be changed
        	const hand = new THREE.Mesh(handGeo, skin);
			hand.position.set(0,.13,0)

			arm.add(notHand);
			arm.add(hand)
			if(i ===0 ){
				arm.rotation.z = Math.PI /4
			arm.position.set(-.25,.125,0)
			} else {
				arm.rotation.z = (7 * Math.PI) /4
			arm.position.set(.25,.125,0)
			}
			
			elf.add(arm)
		}




		// belt
		const beltGeo = new THREE.CylinderGeometry( .28, .28, .08, 32 ); // size of top can be changed
        const beltMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(187, 37, 40)' } );
        const belt = new THREE.Mesh(beltGeo, beltMaterial);
		belt.position.set( 0, -.125, 0 );

		// tunic
		const tunicGeo = new THREE.CylinderGeometry( .25, .325, .1, 32 ); // size of top can be changed
        const tunicMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(20, 107, 58)' } );
        const tunic = new THREE.Mesh(tunicGeo, tunicMaterial);
		tunic.position.set( 0, -.205, 0 );

		        // feet
		for (let i = 0; i < 2; i++) {
			var points = [];
		for ( var j = 0; j < 10; j ++ ) {
			points.push( new THREE.Vector2( (j/120) + .05, -((j/24)**2)) );
		}
		var geometry = new THREE.LatheGeometry( points, 12, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 'rgb(101,67,33)' } );
		var foot = new THREE.Mesh( geometry, material );
		if(i ===0 ){
			foot.position.set(-.125,-.25,0)
			} else {
			foot.position.set(.125,-.25,0)
			}
			elf.add(foot)
		}
        // build elf
        elf.add(body)
        elf.add(head)
        elf.add(hat)
		elf.add(belt)
		elf.add(tunic)
	

			console.log(elf)

		return elf;
    }
    private arm_positions(){

    }
    private feet_positions(){

    }

}
