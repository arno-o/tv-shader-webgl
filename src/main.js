import { Menu } from './ui/Menu.js';
import { Dial } from './ui/Dial.js';
import { InfoText } from './ui/InfoText.js';
import { TVModel } from './models/TVModel.js';
import { SceneSetup } from './scene/SceneSetup.js';
import { PostProcessing } from './scene/PostProcessing.js';
import { ShaderManager } from './shaders/ShaderManager.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';
import { InputHandler } from './utils/InputHandler.js';

class Application {
	constructor() {
		this.sceneSetup = null;
		this.postProcessing = null;
		this.shaderManager = null;
		this.tvModel = null;
		this.menu = null;
		this.dial = null;
		this.infoText = null;
		this.inputHandler = null;
		this.performanceMonitor = null;

		this.init();
	}

	init() {
		this.performanceMonitor = new PerformanceMonitor(true);
		this.performanceMonitor.toggle();

		this.sceneSetup = new SceneSetup();

		this.postProcessing = new PostProcessing(
			this.sceneSetup.getRenderer(),
			this.sceneSetup.getScene(),
			this.sceneSetup.getCamera()
		);

		this.shaderManager = new ShaderManager();

		this.tvModel = new TVModel(this.sceneSetup.getScene(), this.shaderManager);

		this.menu = new Menu(
			this.sceneSetup.getControls(),
			this.sceneSetup.getCamera()
		);

		this.dial = new Dial(this.shaderManager);
		
		this.infoText = new InfoText();
		
		this.menu.onOpen((mode) => {
			this.dial.initialize(mode);
			this.infoText.hide();
		});

		this.menu.onModeChange((newMode, previousMode) => {
			console.log(`Mode changed from ${previousMode} to ${newMode}`);
			this.dial.setMode(newMode);
		});

		this.inputHandler = new InputHandler(
			this.sceneSetup.getCamera(),
			this.tvModel,
			this.postProcessing,
			this.menu
		);

		this.tvModel.load(() => {
			console.log('TV model loaded successfully');
			setTimeout(() => {
				this.infoText.show();
			}, 500);
		});

		window.addEventListener('resize', () => {
			this.sceneSetup.onResize();
			this.postProcessing.onResize();
		});

		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		this.performanceMonitor.begin();

		this.sceneSetup.getControls().update();

		const time = performance.now() / 1000;
		this.shaderManager.update(time);

		this.postProcessing.render();

		this.performanceMonitor.end();
	}
}

new Application();