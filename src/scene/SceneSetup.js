import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from '../config.js';

export class SceneSetup {
	constructor() {
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.controls = null;

		this.init();
	}

	init() {
		this.createScene();
		this.createCamera();
		this.createRenderer();
		this.createControls();
		this.addLighting();
		this.setupResizeHandler();
	}

	createScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(CONFIG.scene.backgroundColor);
	}

	createCamera() {
		const { fov, near, far, initialPosition } = CONFIG.camera;
		this.camera = new THREE.PerspectiveCamera(
			fov,
			window.innerWidth / window.innerHeight,
			near,
			far
		);
		this.camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
	}

	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(this.renderer.domElement);
	}

	createControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = CONFIG.controls.enableDamping;
		this.controls.dampingFactor = CONFIG.controls.dampingFactor;
	}

	addLighting() {
		const { ambient, directional } = CONFIG.lighting;

		const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);
		this.scene.add(ambientLight);

		directional.positions.forEach(pos => {
			const light = new THREE.DirectionalLight(directional.color, directional.intensity);
			light.position.set(pos.x, pos.y, pos.z);
			this.scene.add(light);
		});
	}

	setupResizeHandler() {
		window.addEventListener('resize', () => this.onResize());
	}

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	getScene() {
		return this.scene;
	}

	getCamera() {
		return this.camera;
	}

	getRenderer() {
		return this.renderer;
	}

	getControls() {
		return this.controls;
	}
}
