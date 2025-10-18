import * as THREE from 'three';

import { CONFIG } from '../config.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.composer = null;
        this.outlinePass = null;

        this.init();
    }

    init() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.setupOutlinePass();

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    setupOutlinePass() {
        const { outline } = CONFIG.postProcessing;

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );

        this.outlinePass.edgeStrength = outline.edgeStrength;
        this.outlinePass.edgeGlow = outline.edgeGlow;
        this.outlinePass.edgeThickness = outline.edgeThickness;
        this.outlinePass.visibleEdgeColor.set(outline.visibleEdgeColor);
        this.outlinePass.hiddenEdgeColor.set(outline.hiddenEdgeColor);

        this.composer.addPass(this.outlinePass);
    }

    setOutlineObjects(objects) {
        this.outlinePass.selectedObjects = objects;
    }

    clearOutline() {
        this.outlinePass.selectedObjects = [];
    }

    render() {
        this.composer.render();
    }

    onResize() {
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.outlinePass.setSize(window.innerWidth, window.innerHeight);
    }

    getComposer() {
        return this.composer;
    }

    getOutlinePass() {
        return this.outlinePass;
    }
}
