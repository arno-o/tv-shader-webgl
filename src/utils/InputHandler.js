import * as THREE from 'three';

export class InputHandler {
    constructor(camera, tvModel, postProcessing, menu) {
        this.camera = camera;
        this.tvModel = tvModel;
        this.postProcessing = postProcessing;
        this.menu = menu;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('click', (event) => this.onClick(event));
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }

    onClick(event) {
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const model = this.tvModel.getModel();
        if (!model) return;

        const intersects = this.raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            if (clickedObject.userData.clickable) {
                this.handleButtonClick(clickedObject.name);
            }
        }
    }

    handleButtonClick(buttonName) {
        switch (buttonName) {
            case 'btn1':
                console.log('Button 1 clicked - Zoom mode');
                this.menu.open('zoom');
                break;
            case 'btn2':
                console.log('Button 2 clicked - Gap mode');
                this.menu.open('gap');
                break;
            case 'btn3':
                console.log('Button 3 clicked - Thickness mode');
                this.menu.open('thickness');
                break;
            default:
                console.log('Unhandled clicked object:', buttonName);
        }
    }

    onMouseMove(event) {
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const model = this.tvModel.getModel();
        if (!model) return;

        const intersects = this.raycaster.intersectObjects(model.children, true);

        this.postProcessing.clearOutline();

        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;

            if (hoveredObject.userData.clickable) {
                this.handleButtonHover(hoveredObject);
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }

    handleButtonHover(object) {
        if (object.name === 'btn1' || object.name === 'btn2' || object.name === 'btn3') {
            this.postProcessing.setOutlineObjects([object]);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    updateMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}
