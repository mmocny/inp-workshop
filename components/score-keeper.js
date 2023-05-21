import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class ScoreKeeper extends LitElement {
	static properties = {
		score: {},
		dots: {},
	};

	static styles = [css`
		:host {
			display: grid;
			grid-template-rows: 1fr min-content;

			min-height: 8em;
			margin: 1em;

			align-items: center;
			justify-content: center;
		}

		.score {
			text-align:center;
			font-size: 3em;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		
		.buttons {
			display: grid;
			align-items: center;
			justify-content: center;
		}

		button {
			// margin: 5px;
			padding: 0.5em;
			font-size: 18px;
		}

		button:active {
			background-color:orange;
		}
	`];

	constructor() {
		super();
		this.score = 0;
		this.dots = 0;
	}

	startUpdateUI() {
		++this.score;
		++this.dots;
	}

	endUpdateUI() {
		--this.dots;
	}

	getDotsString() {
		if (this.dots == 0) return "";
		const totalDots = Math.min(8, 2 + this.dots);
		return ".".repeat(totalDots);
	}

	render() {
		const { score } = this;

		return html`
			<div class="score">Score: ${score} ${this.getDotsString()}</div>
			<div class="buttons">
				<button>
					Increment
				</button>
			</div>
		`;
	}
}

customElements.define('score-keeper', ScoreKeeper);