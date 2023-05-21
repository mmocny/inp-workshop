import { MetricViewer } from './metric-viewer.js';

export class MyTimer extends MetricViewer {
  static properties = {
    // ...MetricViewer.properties,
    start: {},
  };

  constructor() {
    super();
    this.metricName = 'Timer';
    this.rating = '';
  }

  start() {
    this.start = performance.now();
    this.tick();
  }

  tick() {
    const elapsed = performance.now() - this.start;
    const sec = pad(Math.floor((elapsed / 1000)));
    const hun = pad(Math.floor((elapsed % 1000) / 10));
    this.score = `${sec}.${hun}`;

    requestAnimationFrame(() => this.tick());
  }

  connectedCallback() {
    super.connectedCallback();
    this.start();
  }
}

customElements.define('my-timer', MyTimer);

function pad(val) {
  return String(val).padStart(2, '0');
}
