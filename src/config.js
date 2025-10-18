import tvModel from 'public/models/tv.glb';

export const CONFIG = {
	camera: {
		fov: 80,
		near: 0.1,
		far: 1000,
		initialPosition: { x: 4, y: 0, z: 0 }
	},

	scene: {
		backgroundColor: '#494949'
	},

	lighting: {
		ambient: {
			color: 0xffffff,
			intensity: 0.6
		},
		directional: {
			color: 0xffffff,
			intensity: 1,
			positions: [
				{ x: 4, y: 8, z: 0 },
				{ x: -4, y: 8, z: 0 }
			]
		}
	},

	postProcessing: {
		outline: {
			edgeStrength: 5,
			edgeGlow: 0.5,
			edgeThickness: 2,
			visibleEdgeColor: '#ffffff',
			hiddenEdgeColor: '#ffffff'
		}
	},

	controls: {
		enableDamping: true,
		dampingFactor: 0.05
	},

	shader: {
		resolution: {
			width: 200,
			height: 300
		},
		uniforms: {
			gapValue: 0.02,
			thicknessValue: 0.04,
			zoomValue: 5.8
		}
	},

	menu: {
		animationDuration: 2,
		menuWidth: -400,
		modes: {
			zoom: {
				label: 'Zoom',
				targetCoords: { x: -2, y: 0, z: -0.7 },
				cameraCoords: { x: 2, y: -0.2, z: 0 }
			},
			gap: {
				label: 'Gap',
				targetCoords: { x: -2, y: 0, z: -0.7 },
				cameraCoords: { x: 1.5, y: 0, z: 0.5 }
			},
			thickness: {
				label: 'Thickness',
				targetCoords: { x: -2, y: 0, z: -0.7 },
				cameraCoords: { x: 2.2, y: -0.5, z: -0.3 }
			}
		}
	},

	models: {
		tv: tvModel
	},

	dial: {
		maxRotation: 270,
		zoom: {
			min: 3,
			max: 8
		},
		gap: {
			min: 0.0,
			max: 0.1
		},
		thickness: {
			min: 0.01,
			max: 0.1
		}
	}
};
