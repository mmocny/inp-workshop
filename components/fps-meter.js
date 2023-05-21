import { MetricViewer } from './metric-viewer.js';

const WINDOW = 1000;

export class FpsMeter extends MetricViewer {
	static properties = {
		// ...MetricViewer.properties,
		frameTimes: {},
	};

	constructor() {
		super();
		this.metricName = "FPS";
		this.frameTimes = [];
	}

	get score() {
		return Math.floor((this.frameTimes.length - 1) / WINDOW * 1000);
	}

	get rating() {
		if (this.score > 40) return 'good';
		if (this.score > 20) return 'needs-improvement';
		return 'poor';
	}

	start() {
		requestAnimationFrame(this.tick.bind(this));
	}

	addFrameTime(time) {
		this.frameTimes = this.frameTimes.filter(frameTime => (time - frameTime) <= WINDOW);
		this.frameTimes.push(time);
	}

	tick(time) {
		this.addFrameTime(time);
		this.start();
	}

	connectedCallback() {
		super.connectedCallback();
		this.start();
	}
}

customElements.define('fps-meter', FpsMeter);