import * as THREE from 'three';
import { Tree } from './Tree.class';
import { Car } from './Car.class';
export class App {
	private sceneWidth;
	private sceneHeight;
	private camera;
	private scene;
	private renderer;
	private dom;
	private hero;
	private sun;
	private Cars;
	private ground;
	private rollingGroundSphere;
	private heroSphere;
	private rollingSpeed = 0.008;
	private worldRadius = 26;
	private heroRadius = 0.2;
	private sphericalHelper;
	private pathAngleValues;
	private heroBaseY = 2;
	private bounceValue = 0.1;
	private gravity = 0.005;
	private leftLane = -1;
	private rightLane = 1;
	private middleLane = 0;
	private currentLane;
	private clock;
	private jumping;
	private treeReleaseInterval = 0.5;
	private lastTreeReleaseTime = 0;
	private treesInPath;
	private treesPool;
	private particleGeometry;
	private particleCount = 20;
	private explosionPower = 1.06;
	private particles;
	//var stats;
	private scoreText;
	private score;
	private hasCollided;
	private Trees;
	constructor() {
		this.Trees = new Tree();
		this.Cars = new Car();
		this.init();
	}

	init = () => {
		// set up the scene
		this.createScene();

		//call game loop
		this.update();
	};

	createScene = () => {
		this.hasCollided = false;
		this.score = 0;
		this.treesInPath = [];
		this.treesPool = [];
		this.clock = new THREE.Clock();
		this.clock.start();
		this.sphericalHelper = new THREE.Spherical();
		this.pathAngleValues = [1.52, 1.57, 1.62];
		this.sceneWidth = window.innerWidth;
		this.sceneHeight = window.innerHeight;
		this.scene = new THREE.Scene(); //the 3d scene
		this.scene.fog = new THREE.FogExp2(0xf0fff0, 0.14);
		this.camera = new THREE.PerspectiveCamera(60, this.sceneWidth / this.sceneHeight, 0.1, 1000); //perspective camera
		this.renderer = new THREE.WebGLRenderer({ alpha: true }); //renderer with transparent backdrop
		this.renderer.setClearColor(0xfffafa, 1);
		this.renderer.shadowMap.enabled = true; //enable shadow
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(this.sceneWidth, this.sceneHeight);
		this.dom = document.getElementById('TutContainer');
		this.dom.appendChild(this.renderer.domElement);
		//stats = new Stats();
		//dom.appendChild(stats.dom);
		this.createTreesPool();
		this.addWorld();
		this.addHero();
		this.addLight();
		this.addExplosion();

		this.camera.position.z = 6.5;
		this.camera.position.y = 2.5;

		window.addEventListener('resize', this.onWindowResize, false); //resize callback

		document.onkeydown = this.handleKeyDown;

		this.scoreText = document.createElement('div');
		this.scoreText.style.position = 'absolute';
		//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
		this.scoreText.style.width = 100;
		this.scoreText.style.height = 100;
		//scoreText.style.backgroundColor = "blue";
		this.scoreText.innerHTML = '0';
		this.scoreText.style.top = 50 + 'px';
		this.scoreText.style.left = 10 + 'px';
		document.body.appendChild(this.scoreText);

		var infoText = document.createElement('div');
		infoText.style.position = 'absolute';
		infoText.style.width = '100';
		infoText.style.height = '100';
		infoText.style.backgroundColor = 'yellow';
		infoText.innerHTML = 'UP - Jump, Left/Right - Move';
		infoText.style.top = 10 + 'px';
		infoText.style.left = 10 + 'px';
		document.body.appendChild(infoText);
	};
	addExplosion = () => {
		this.particleGeometry = new THREE.Geometry();
		for (var i = 0; i < this.particleCount; i++) {
			var vertex = new THREE.Vector3();
			this.particleGeometry.vertices.push(vertex);
		}
		var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xfffafa,
			size: 0.2
		});
		this.particles = new THREE.Points(this.particleGeometry, pMaterial);
		this.scene.add(this.particles);
		this.particles.visible = false;
	};
	createTreesPool = () => {
		var maxTreesInPool = 10;
		var newTree;
		for (var i = 0; i < maxTreesInPool; i++) {
			newTree = this.Trees.createTree();
			this.treesPool.push(newTree);
		}
	};
	handleKeyDown = keyEvent => {
		if (this.jumping) return;
		var validMove = true;
		if (keyEvent.keyCode === 37) {
			//left
			if (this.currentLane == this.middleLane) {
				this.currentLane = this.leftLane;
			} else if (this.currentLane == this.rightLane) {
				this.currentLane = this.middleLane;
			} else {
				validMove = false;
			}
		} else if (keyEvent.keyCode === 39) {
			//right
			if (this.currentLane == this.middleLane) {
				this.currentLane = this.rightLane;
			} else if (this.currentLane == this.leftLane) {
				this.currentLane = this.middleLane;
			} else {
				validMove = false;
			}
		} else {
			if (keyEvent.keyCode === 38) {
				//up, jump
				this.bounceValue = 0.1;
				this.jumping = true;
			}
			validMove = false;
		}
		//heroSphere.position.x=currentLane;
		if (validMove) {
			this.jumping = true;
			this.bounceValue = 0.06;
		}
	};
	addHero = () => {
		this.heroSphere = this.Cars.createCar();
		this.heroSphere.receiveShadow = true;
		this.heroSphere.castShadow = true;
		this.scene.add(this.heroSphere);
		this.heroSphere.position.y = this.heroBaseY;
		this.heroSphere.position.z = 4.8;
		this.currentLane = this.middleLane;
		this.heroSphere.position.x = this.currentLane;
	};
	addWorld = () => {
		var sides = 40;
		var tiers = 40;
		var sphereGeometry = new THREE.SphereGeometry(this.worldRadius, sides, tiers);
		var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xfffafa });

		var vertexIndex;
		var vertexVector = new THREE.Vector3();
		var nextVertexVector = new THREE.Vector3();
		var firstVertexVector = new THREE.Vector3();
		var offset = new THREE.Vector3();
		var currentTier = 1;
		var lerpValue = 0.5;
		var heightValue;
		var maxHeight = 0.07;
		for (var j = 1; j < tiers - 2; j++) {
			currentTier = j;
			for (var i = 0; i < sides; i++) {
				vertexIndex = currentTier * sides + 1;
				vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
				if (j % 2 !== 0) {
					if (i == 0) {
						firstVertexVector = vertexVector.clone();
					}
					nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
					if (i == sides - 1) {
						nextVertexVector = firstVertexVector;
					}
					lerpValue = Math.random() * (0.75 - 0.25) + 0.25;
					vertexVector.lerp(nextVertexVector, lerpValue);
				}
				heightValue = Math.random() * maxHeight - maxHeight / 2;
				offset = vertexVector
					.clone()
					.normalize()
					.multiplyScalar(heightValue);
				sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
			}
		}
		this.rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.rollingGroundSphere.receiveShadow = true;
		this.rollingGroundSphere.castShadow = false;
		this.rollingGroundSphere.rotation.z = -Math.PI / 2;
		this.scene.add(this.rollingGroundSphere);
		this.rollingGroundSphere.position.y = -24;
		this.rollingGroundSphere.position.z = 2;
		this.addWorldTrees();
	};
	addLight = () => {
		var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
		this.scene.add(hemisphereLight);
		this.sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
		this.sun.position.set(12, 6, -7);
		this.sun.castShadow = true;
		this.scene.add(this.sun);
		//Set up shadow properties for the sun light
		this.sun.shadow.mapSize.width = 256;
		this.sun.shadow.mapSize.height = 256;
		this.sun.shadow.camera.near = 0.5;
		this.sun.shadow.camera.far = 50;
	};
	addPathTree = () => {
		var options = [0, 1, 2];
		var lane = Math.floor(Math.random() * 3);
		this.addTree(true, lane);
		options.splice(lane, 1);
		if (Math.random() > 0.5) {
			lane = Math.floor(Math.random() * 2);
			this.addTree(true, options[lane]);
		}
	};
	addWorldTrees = () => {
		var numTrees = 36;
		var gap = 6.28 / 36;
		for (var i = 0; i < numTrees; i++) {
			this.addTree(false, i * gap, true);
			this.addTree(false, i * gap, false);
		}
	};
	addTree = (inPath, row, isLeft?) => {
		var newTree;
		if (inPath) {
			if (this.treesPool.length == 0) return;
			newTree = this.treesPool.pop();
			newTree.visible = true;
			//console.log("add tree");
			this.treesInPath.push(newTree);
			this.sphericalHelper.set(this.worldRadius - 0.3, this.pathAngleValues[row], -this.rollingGroundSphere.rotation.x + 4);
		} else {
			newTree = this.Trees.createTree();
			var forestAreaAngle = 0; //[1.52,1.57,1.62];
			if (isLeft) {
				forestAreaAngle = 1.68 + Math.random() * 0.1;
			} else {
				forestAreaAngle = 1.46 - Math.random() * 0.1;
			}
			this.sphericalHelper.set(this.worldRadius - 0.3, forestAreaAngle, row);
		}
		newTree.position.setFromSpherical(this.sphericalHelper);
		var rollingGroundVector = this.rollingGroundSphere.position.clone().normalize();
		var treeVector = newTree.position.clone().normalize();
		newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
		newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

		this.rollingGroundSphere.add(newTree);
	};

	update = () => {
		//stats.update();
		//animate
		this.rollingGroundSphere.rotation.x += this.rollingSpeed;
		// this.heroSphere.rotation.x -= this.heroRollingSpeed;
		if (this.heroSphere.position.y <= this.heroBaseY) {
			this.jumping = false;
			this.bounceValue = Math.random() * 0.04 + 0.005;
		}
		this.heroSphere.position.y += this.bounceValue;
		this.heroSphere.position.x = THREE.Math.lerp(this.heroSphere.position.x, this.currentLane, 2 * this.clock.getDelta()); //clock.getElapsedTime());
		this.bounceValue -= this.gravity;
		if (this.clock.getElapsedTime() > this.treeReleaseInterval) {
			this.clock.start();
			this.addPathTree();
			if (!this.hasCollided) {
				this.score += 2 * this.treeReleaseInterval;
				this.scoreText.innerHTML = this.score.toString();
			}
		}
		this.doTreeLogic();
		this.doExplosionLogic();
		this.render();
		requestAnimationFrame(this.update); //request next update
	};
	doTreeLogic = () => {
		var oneTree;
		var treePos = new THREE.Vector3();
		var treesToRemove = [];
		this.treesInPath.forEach((element, index) => {
			oneTree = this.treesInPath[index];
			treePos.setFromMatrixPosition(oneTree.matrixWorld);
			if (treePos.z > 6 && oneTree.visible) {
				//gone out of our view zone
				treesToRemove.push(oneTree);
			} else {
				//check collision
				if (treePos.distanceTo(this.heroSphere.position) <= 0.6) {
					console.log('hit');
					this.hasCollided = true;
					this.explode();
				}
			}
		});
		var fromWhere;
		treesToRemove.forEach((element, index) => {
			oneTree = treesToRemove[index];
			fromWhere = this.treesInPath.indexOf(oneTree);
			this.treesInPath.splice(fromWhere, 1);
			this.treesPool.push(oneTree);
			oneTree.visible = false;
			console.log('remove tree');
		});
	};
	doExplosionLogic = () => {
		if (!this.particles.visible) return;
		for (var i = 0; i < this.particleCount; i++) {
			this.particleGeometry.vertices[i].multiplyScalar(this.explosionPower);
		}
		if (this.explosionPower > 1.005) {
			this.explosionPower -= 0.001;
		} else {
			this.particles.visible = false;
		}
		this.particleGeometry.verticesNeedUpdate = true;
	};
	explode = () => {
		this.particles.position.y = 2;
		this.particles.position.z = 4.8;
		this.particles.position.x = this.heroSphere.position.x;
		for (var i = 0; i < this.particleCount; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = -0.2 + Math.random() * 0.4;
			vertex.y = -0.2 + Math.random() * 0.4;
			vertex.z = -0.2 + Math.random() * 0.4;
			this.particleGeometry.vertices[i] = vertex;
		}
		this.explosionPower = 1.07;
		this.particles.visible = true;
	};
	render = () => {
		this.renderer.render(this.scene, this.camera); //draw
	};
	gameOver = () => {
		//cancelAnimationFrame( globalRenderID );
		//window.clearInterval( powerupSpawnIntervalID );
	};
	onWindowResize = () => {
		//resize & align
		this.sceneHeight = window.innerHeight;
		this.sceneWidth = window.innerWidth;
		this.renderer.setSize(this.sceneWidth, this.sceneHeight);
		this.camera.aspect = this.sceneWidth / this.sceneHeight;
		this.camera.updateProjectionMatrix();
	};
}
