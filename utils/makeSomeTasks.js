export function block(ms) {
	const target = performance.now() + ms;
	// console.group(`Inside block(${ms})`);
	// console.log('Starting to block');

	while (performance.now() < target);

	// console.log('Done blocking');
	// console.groupEnd();
	return ms + (performance.now() - target);
}

export function makeSomeTasks(args = {}) {
	const { total, min, max } = {
		total: 3000,
		min: 10,
		max: 100,
		...args
	}

	function getRandomRange(min, max) {
		const range = max - min;
		// Linear
		// const ease = (x) => x;
		// Cubic
		// const ease = (x) => x * x * x;
		// Quint
		const ease = (x) => x * x * x * x * x;

		const num = ease(Math.random()) * range;
		return min + num;
	}

	const tasks = [];

	let remainder = total;
	while (remainder > 0) {
		const ms = Math.min(remainder, getRandomRange(min, max));
		tasks.push(() => block(ms));
		remainder -= ms;
	}

	return tasks;
}
