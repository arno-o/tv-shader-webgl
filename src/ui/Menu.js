import { gsap } from "gsap";
import { CONFIG } from '../config.js';

export class Menu {
    constructor(controls, camera) {
        this.controls = controls;
        this.camera = camera;
        this.isOpen = false;
        this.currentMode = null; // 'zoom', 'gap', or 'thickness'
        this.onOpenCallback = null;
        this.onCloseCallback = null;
        this.onModeChangeCallback = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close button
        document.querySelector(".animated-button")?.addEventListener('click', () => this.close());

        // ESC key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    open(mode = 'zoom', onComplete) {
        if (this.isOpen && this.currentMode === mode) return;

        const wasOpen = this.isOpen;
        this.isOpen = true;
        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Update menu title
        this.updateMenuTitle(mode);

        const modeConfig = CONFIG.menu.modes[mode];
        const { animationDuration } = CONFIG.menu;

        // Determine animation duration based on whether we're switching modes or opening fresh
        const duration = wasOpen ? animationDuration * 0.6 : animationDuration;

        let tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
                if (this.onOpenCallback) this.onOpenCallback(mode);
                if (wasOpen && previousMode !== mode && this.onModeChangeCallback) {
                    this.onModeChangeCallback(mode, previousMode);
                }
            }
        });

        // Animate camera target
        tl.to(this.controls.target, {
            x: modeConfig.targetCoords.x,
            y: modeConfig.targetCoords.y,
            z: modeConfig.targetCoords.z,
            duration: duration,
            ease: 'power3.inOut'
        });

        // Animate camera position
        tl.to(this.camera.position, {
            x: modeConfig.cameraCoords.x,
            y: modeConfig.cameraCoords.y,
            z: modeConfig.cameraCoords.z,
            duration: duration,
            ease: 'power3.inOut'
        }, `-=${duration}`);

        if (!wasOpen) {
            // Slide in menu (only if opening for the first time)
            tl.to(".menu", {
                right: 0,
                duration: duration,
                ease: 'power3.inOut'
            }, `-=${duration}`);

            // Fade in close button
            tl.to(".animated-button", {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                onStart: () => {
                    document.querySelector('.animated-button').classList.add('visible');
                }
            }, "-=0.5");
        }

        // Disable controls
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
    }

    updateMenuTitle(mode) {
        const modeConfig = CONFIG.menu.modes[mode];
        const menuTitle = document.querySelector('.menu h2');
        if (menuTitle) {
            menuTitle.textContent = `${modeConfig.label} Control`;
        }
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.currentMode = null;

        const { animationDuration, menuWidth } = CONFIG.menu;

        let tl = gsap.timeline({
            onComplete: () => {
                if (this.onCloseCallback) this.onCloseCallback();
            }
        });

        // Fade out close button
        tl.to(".animated-button", {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                document.querySelector('.animated-button').classList.remove('visible');
            }
        });

        // Slide out menu
        tl.to(".menu", {
            right: menuWidth,
            duration: animationDuration,
            ease: 'power3.inOut'
        }, "-=0.1");

        // Reset camera target
        tl.to(this.controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: animationDuration,
            ease: 'power3.inOut'
        }, `-=${animationDuration}`);

        // Reset camera position
        tl.to(this.camera.position, {
            x: CONFIG.camera.initialPosition.x,
            y: CONFIG.camera.initialPosition.y,
            z: CONFIG.camera.initialPosition.z,
            duration: animationDuration,
            ease: 'power3.inOut'
        }, `-=${animationDuration}`);

        // Re-enable controls
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
    }

    onOpen(callback) {
        this.onOpenCallback = callback;
    }

    onClose(callback) {
        this.onCloseCallback = callback;
    }

    onModeChange(callback) {
        this.onModeChangeCallback = callback;
    }

    getIsOpen() {
        return this.isOpen;
    }

    getCurrentMode() {
        return this.currentMode;
    }
}
