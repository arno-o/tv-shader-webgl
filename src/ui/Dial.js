import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { CONFIG } from '../config.js';

gsap.registerPlugin(Draggable);

export class Dial {
    constructor(shaderManager) {
        this.shaderManager = shaderManager;
        this.initialized = false;
        this.currentValue = 0;
        this.arcLength = 0;
        this.currentMode = 'zoom';
        this.draggableInstance = null;

        this.svgNode = null;
        this.dialValueDisplay = null;
        this.dragHandle = null;
        this.info = null;
        this.dialLine = null;
        this.arcFill = null;
        this.dialLineBg = null;
    }

    initialize(mode = 'zoom') {
        this.currentMode = mode;

        this.svgNode = document.getElementById('svg-node');
        this.dialValueDisplay = document.getElementById('dial-value');
        this.dragHandle = document.getElementById('drag-handle');
        this.info = document.getElementById('info');
        this.dialLine = document.getElementById('dial-line');
        this.arcFill = document.getElementById('arc-fill');

        if (!this.svgNode || !this.dragHandle || !this.dialLine || !this.arcFill) {
            console.warn('Dial elements not found');
            return;
        }

        console.log(`Initializing dial for mode: ${mode}`);

        if (!this.initialized) {
            this.initialized = true;

            gsap.set('body', { userSelect: 'none' });

            this.arcLength = this.arcFill.getTotalLength();
            gsap.set(this.arcFill, {
                strokeDasharray: this.arcLength,
                strokeDashoffset: this.arcLength
            });

            gsap.set(this.dialLine, {
                autoAlpha: 1,
                svgOrigin: '142.1 100.2'
            });

            gsap.set(this.dragHandle, {
                svgOrigin: '142.1 100.2'
            });

            this.draggableInstance = Draggable.create(this.dragHandle, {
                type: 'rotation',
                bounds: { minRotation: -135, maxRotation: 135 },
                inertia: true,
                onDrag: () => this.update(),
                onThrowUpdate: () => this.update(),
                onPress: () => this.onPress(),
                onRelease: () => this.onRelease()
            })[0];

            this.dialLineBg = this.dragHandle;
        }

        // Set initial rotation based on current mode and shader value
        this.setDialToCurrentValue(mode);
        this.update();
    }

    setMode(mode) {
        this.currentMode = mode;
        this.setDialToCurrentValue(mode);
        this.update();
    }

    setDialToCurrentValue(mode) {
        let currentValue;
        switch (mode) {
            case 'zoom':
                currentValue = this.shaderManager.getZoomValue();
                break;
            case 'gap':
                currentValue = this.shaderManager.getGapValue();
                break;
            case 'thickness':
                currentValue = this.shaderManager.getThicknessValue();
                break;
            default:
                currentValue = CONFIG.shader.uniforms.zoomValue;
        }
        
        const initialRotation = this.getRotationFromValue(currentValue, mode);
        
        gsap.set(this.dragHandle, {
            rotation: initialRotation
        });
        
        // Update the draggable's internal rotation value
        if (this.draggableInstance) {
            this.draggableInstance.update();
        }
    }

    getRotationFromValue(value, mode) {
        const modeConfig = CONFIG.dial[mode];
        // Calculate percentage from value
        const percentage = ((value - modeConfig.min) / (modeConfig.max - modeConfig.min)) * 100;
        // Convert percentage to rotation (-135 to 135 degrees)
        const rotation = (percentage / 100) * 270 - 135;
        return rotation;
    }

    update() {
        if (!this.dialLineBg || !this.arcFill) return;

        const rotation = gsap.getProperty(this.dialLineBg, 'rotation');
        const percentage = ((rotation + 135) / 270) * 100;
        this.currentValue = Math.round(percentage);

        if (this.dialValueDisplay) {
            this.dialValueDisplay.textContent = this.currentValue;
        }

        gsap.set(this.dialLine, { rotation: rotation });

        const fillAmount = this.arcLength - (this.arcLength * (this.currentValue / 100));
        gsap.to(this.arcFill, {
            strokeDashoffset: fillAmount,
            duration: 0.3,
            ease: 'power2.out'
        });

        this.updateShaderValue();
    }

    updateShaderValue() {
        if (!this.shaderManager) return;

        const modeConfig = CONFIG.dial[this.currentMode];
        const value = modeConfig.min + (this.currentValue / 100) * (modeConfig.max - modeConfig.min);

        switch (this.currentMode) {
            case 'zoom':
                this.shaderManager.setZoomValue(value);
                break;
            case 'gap':
                this.shaderManager.setGapValue(value);
                break;
            case 'thickness':
                this.shaderManager.setThicknessValue(value);
                break;
        }
    }

    onPress() {
        console.log('Dial pressed');
        gsap.to(this.info, { autoAlpha: 0, duration: 0.3 });
    }

    onRelease() {
        console.log('Dial released');
        gsap.to(this.info, { autoAlpha: 0.7, duration: 0.3, delay: 1 });
    }

    getValue() {
        return this.currentValue;
    }
}
