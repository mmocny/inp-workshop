import { onInteraction } from '../utils/onInteraction.js';
import { MetricViewer } from './metric-viewer.js';

export class InteractionScore extends MetricViewer {
	constructor() {
		super();
		this.metricName = 'Interaction';
	}

	connectedCallback() {
		super.connectedCallback();

		onInteraction(({ value, rating }) => {
			this.score = Math.round(value);
			this.rating = rating;
		});
	}
}

customElements.define('interaction-score', InteractionScore);