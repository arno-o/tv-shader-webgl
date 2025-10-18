import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from '../config.js';

export class TVModel {
	constructor(scene, shaderManager) {
		this.scene = scene;
		this.shaderManager = shaderManager;
		this.model = null;
		this.screenMesh = null;
		this.loader = new GLTFLoader();
		this.onLoadCallback = null;
	}

	load(onLoad) {
		this.onLoadCallback = onLoad;

		this.loader.load(
			CONFIG.models.tv,
			(gltf) => this.onModelLoaded(gltf),
			(xhr) => this.onProgress(xhr),
			(error) => this.onError(error)
		);
	}

	onModelLoaded(gltf) {
		this.scene.add(gltf.scene);
		this.model = gltf.scene;

		console.log('Model parts:');
		gltf.scene.traverse((child) => {
			if (child.isMesh) {
				console.log('- ' + child.name);
				child.userData.clickable = true;

				if (child.name === 'tv-screen_1') {
					this.screenMesh = child;
					this.applyShader();
				}
			}
		});

		if (this.onLoadCallback) {
			this.onLoadCallback(this.model);
		}
	}

	applyShader() {
		if (this.screenMesh && this.shaderManager) {
			this.screenMesh.material = this.shaderManager.getMaterial();
			console.log('Shader applied to TV screen');
		}
	}

	onProgress(xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	}

	onError(error) {
		console.log(`An error happened: ${error.message}`);
	}

	getModel() {
		return this.model;
	}

	getScreenMesh() {
		return this.screenMesh;
	}
}
