import Stats from 'stats.js';

export class PerformanceMonitor {
    constructor(enabled = true) {
        this.enabled = enabled;
        this.stats = null;

        if (this.enabled) {
            this.init();
        }
    }

    init() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);
    }

    begin() {
        if (this.stats) {
            this.stats.begin();
        }
    }

    end() {
        if (this.stats) {
            this.stats.end();
        }
    }

    toggle() {
        if (this.stats) {
            this.stats.dom.style.display = this.stats.dom.style.display === 'none' ? 'block' : 'none';
        }
    }
}
