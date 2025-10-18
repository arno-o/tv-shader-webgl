import * as THREE from 'three';
import fragmentShaderCode from '../frag.glsl?raw';
import { CONFIG } from '../config.js';

export class ShaderManager {
	constructor() {
		this.material = null;
		this.init();
	}

	init() {
		const vertexShader = `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`;

		const wrappedFragmentShader = fragmentShaderCode
			.replace('precision highp float;', 'precision mediump float;\nvarying vec2 vUv;')
			.replace(/gl_FragCoord\.xy/g, 'vUv * iResolution');

		const { width, height } = CONFIG.shader.resolution;
		const { gapValue, thicknessValue, zoomValue } = CONFIG.shader.uniforms;

		this.material = new THREE.ShaderMaterial({
			uniforms: {
				iResolution: { value: new THREE.Vector2(width, height) },
				iGlobalTime: { value: 0.0 },
				iTime: { value: 0.0 },
				iOffset: { value: new THREE.Vector2(0, 0) },
				iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
				iChannel0: { value: null },
				gapValue: { value: gapValue },
				thicknessValue: { value: thicknessValue },
				zoomValue: { value: zoomValue }
			},
			vertexShader: vertexShader,
			fragmentShader: wrappedFragmentShader
		});
	}

	update(time) {
		if (this.material) {
			this.material.uniforms.iTime.value = time;
			this.material.uniforms.iGlobalTime.value = time;
		}
	}

	setZoomValue(value) {
		if (this.material) {
			this.material.uniforms.zoomValue.value = value;
		}
	}

	setGapValue(value) {
		if (this.material) {
			this.material.uniforms.gapValue.value = value;
		}
	}

	setThicknessValue(value) {
		if (this.material) {
			this.material.uniforms.thicknessValue.value = value;
		}
	}

	// Getters to retrieve current values
	getZoomValue() {
		return this.material ? this.material.uniforms.zoomValue.value : CONFIG.shader.uniforms.zoomValue;
	}

	getGapValue() {
		return this.material ? this.material.uniforms.gapValue.value : CONFIG.shader.uniforms.gapValue;
	}

	getThicknessValue() {
		return this.material ? this.material.uniforms.thicknessValue.value : CONFIG.shader.uniforms.thicknessValue;
	}

	getMaterial() {
		return this.material;
	}
}
