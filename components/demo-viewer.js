import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { demos } from '../demos.js';

export class DemoViewer extends LitElement {
	static properties = {
		demo: {},
		nextDemo: {},
	};

	static styles = [ css`
		:host {
			display: grid;
			grid-template-rows: min-content 1fr;
			margin-bottom: 100px;
		}

		pre {
			padding: 0.5em;
			background-color: #eef;
			border: 1px solid #dde;
			border-radius: 5px;
			tab-size: 2;
			margin: 0;
			width: 100%;

			overflow: scroll;
		}

		// details summary::-webkit-details-marker,
		// details summary::marker {
		// 	display: none; 
		// 	content: "";
		// }
	`];

	constructor() {
		super();

		const demoNumber = this.demoNumber;
		const nextDemoNumber = demoNumber+1;
		this.demo = demos[demoNumber];

		if (nextDemoNumber < demos.length) {
			this.nextDemo = demos[nextDemoNumber];
		} else {
			this.nextDemo = {};
		}

	}

	get demoNumber() {
		const params = (new URL(document.location)).searchParams;
		const num = +params.get('demo');
		return num;
	}

	get hasNextDemo() {
		return !!this.nextDemo;
	}

	get nextDemoLink() {
		const next = this.demoNumber + 1;
		if (next >= demos.length)
			return html`No more demos!`;
		return html`<a href="?demo=${next}">Next Demo</a>`;

	}

	get prevDemoLink() {
		const prev = this.demoNumber - 1;
		if (prev < 0)
			return html`<a>Prev Demo</a>`;
		return html`<a href="?demo=${prev}">Prev Demo</a>`;
	}

	visibleString(fn) {
		if (!fn) return "";
		const lines = fn.toString().split('\n').slice(1,-1);
		if (lines.length == 0) return "";
		const num_tabs = lines[0].search(/[^\t]/);
		const readable_code = lines.map(s => s.substring(num_tabs)).join('\n');
		return readable_code;
	}

	toggleNextCode(evt) {
		if (!evt.target.open) return;
		window.scrollTo({ top: window.scrollY + this.getBoundingClientRect().y });
	}

	render() {
		const { title: currentDemoTitle, visible: currentDemoCode } = this.demo;
		// const { title: nextDemoTitle, visible: nextDemoCode } = this.nextDemo;

		const currentVisibleDemoCode = this.visibleString(currentDemoCode);
		// const nextVisibleDemoCode = this.visibleString(nextDemoCode);

		return html`
		${!currentVisibleDemoCode ?
			html`` :
			html`
				<div>
					<summary>${currentDemoTitle}</summary>
					<pre>${currentVisibleDemoCode}</pre>
				</div>
			`
		}

		${this.nextDemoLink}`;

		// ${!nextDemoTitle ? html`` : !nextVisibleDemoCode ? this.nextDemoLink :
		// 	html`
		// 		<details @toggle=${this.toggleNextCode}>
		// 			<summary>Next: ${nextDemoTitle}</summary>
		// 			<pre>${nextVisibleDemoCode}</pre>
		// 			${this.nextDemoLink}
		// 		</details>
		// 	`
		// }

		// <div>
		// 	${this.prevDemoLink} 
		// </div>
	}

	connectedCallback() {
		super.connectedCallback();

		// Calls the demo code
		this.demo.visible();
		this.demo.hidden();
	}
}

customElements.define('demo-viewer', DemoViewer);