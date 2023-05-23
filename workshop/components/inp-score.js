// import { onINP } from 'https://unpkg.com/web-vitals@3?module';
import { onINP } from 'web-vitals';
import { MetricViewer } from './metric-viewer.js';

export class InpScore extends MetricViewer {
	constructor() {
		super();
		this.metricName = 'INP';
	}

	connectedCallback() {
		super.connectedCallback();

		onINP(({ value, rating }) => {
			this.score = Math.round(value);
			this.rating = rating;
		}, { reportAllChanges: true, durationThreshold: 0 });
	}
}

customElements.define('inp-score', InpScore);