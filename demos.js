import { markNeedsNextPaint, schedulerDotYield, schedulerDotYieldIfNeeded, schedulerDotYieldIfNeededWithDeadlines } from './utils/schedulerDotYield.js';
import { makeSomeTasks } from './utils/makeSomeTasks.js'
import { benchmark, reportBenchmarkResultsToConsole } from './utils/benchmark.js';

/*** Set up ***/

reportBenchmarkResultsToConsole();

const score = document.querySelector('score-keeper');
const increment = score.shadowRoot.querySelector('button');

// This is the default implementation, gets overridden by some demos
function doSomeWork(ms) {
	const tasks = makeSomeTasks({ total: ms });
	for (let task of tasks) {
		task();
	}
}

/*** Each of these is one Page of the demo ***/

export const demos = [
/*
 * Basic Demos
 */

	{
		title: 'Hello World',
		visible() {
		},
		hidden() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				score.endUpdateUI();
			});

			for (let el of document.querySelectorAll('body > main > *:not(score-keeper):not(demo-viewer)')) {
				el.style.visibility = "hidden";
			}
		}
	},

	{
		title: 'Click Handler',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click + setTimeout',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				setTimeout(
					() => score.endUpdateUI()
				, 1000);
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click + setTimeout everything',
		visible() {
			increment.addEventListener('click', () => {
				setTimeout(
					() => {
						score.startUpdateUI();
						score.endUpdateUI();
					}
				, 1000);
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'setTimeout -> 3s Long Task',
		visible() {
			setTimeout(() => {
				doSomeWork(3000);
			}, 2000);

			increment.addEventListener('click', () => {
				score.startUpdateUI();
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'setInterval -> 1s Long Task',
		visible() {
			setInterval(() => {
				doSomeWork(1000);
			}, 2000);

			increment.addEventListener('click', () => {
				score.startUpdateUI();
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

/*
 * Scheduling work with existing APIs
 */

	{
		title: 'Click -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				doSomeWork(1000);
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click -> setTimeout(0) -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				setTimeout(() => {
					doSomeWork(1000);
					score.endUpdateUI();
				}, 0);
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click -> setTimeout(50) -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				setTimeout(() => {
					doSomeWork(1000);
					score.endUpdateUI();
				}, 50);
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click -> requestAnimationFrame() -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				requestAnimationFrame(() => {
					doSomeWork(1000);
					score.endUpdateUI();
				});
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click -> requestAnimationFrame() -> setTimeout(0) -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				requestAnimationFrame(() => {
					setTimeout(() => {
						doSomeWork(1000)
						score.endUpdateUI();
					}, 0);
				});
			});
		},
		hidden() {
		}
	},

	{
		title: 'Click -> requestIdleCallback() -> Work',
		visible() {
			increment.addEventListener('click', () => {
				score.startUpdateUI();
				requestIdleCallback(() => {
					doSomeWork(1000);
					score.endUpdateUI();
				});
			});
		},
		hidden() {
		}
	},


/*
 * scheduler.yield()
 */

	{
		title: 'Discuss doSomeWork()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					task();
				}
			}

			increment.addEventListener('click', () => {
				score.startUpdateUI();
				requestIdleCallback(async () => {
					await doSomeWork(1000)
					score.endUpdateUI();
				});
			});
		},
		hidden() {
		}
	},

	{
		title: 'Add yield()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					task();
					await schedulerDotYield(); // <-- Cool
				}
			}

			increment.addEventListener('click', () => {
				score.startUpdateUI();
				requestIdleCallback(async () => {
					await doSomeWork(1000);
					score.endUpdateUI();
				});
			});
		},
		hidden() {
		}
	},

	{
		title: 'Remove requestIdleCallback()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					await schedulerDotYield(); // <-- Do this first
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				await doSomeWork(1000);
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

/*
 * "it's complicated."
 */

	{
		title: 'Benchmark yield()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					await schedulerDotYield();
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				await benchmark(() => doSomeWork(1000));
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'Add isInputPending()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					if (navigator.scheduling.isInputPending()) {
						await schedulerDotYield();
					}
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				await benchmark(() => doSomeWork(1000));
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},

	{
		title: 'isInputPending() + requestIdleCallback()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					if (navigator.scheduling.isInputPending()) {
						await schedulerDotYield();
					}
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				requestIdleCallback(async () => {
					await benchmark(() => doSomeWork(1000));
					score.endUpdateUI();
				});
			});
		},
		hidden() {
		}
	},

	{
		title: 'Input-aware yield()',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					await schedulerDotYieldIfNeeded();
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				markNeedsNextPaint();
				await benchmark(() => doSomeWork(1000));
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},


	{
		title: 'Input-aware yield() + deadlines',
		visible() {
			async function doSomeWork(ms) {
				const tasks = makeSomeTasks({ total: ms });
				for (let task of tasks) {
					await schedulerDotYieldIfNeededWithDeadlines();
					task();
				}
			}

			increment.addEventListener('click', async () => {
				score.startUpdateUI();
				markNeedsNextPaint();
				await benchmark(() => doSomeWork(1000));
				score.endUpdateUI();
			});
		},
		hidden() {
		}
	},
];
