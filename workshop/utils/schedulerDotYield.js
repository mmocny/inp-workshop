function setImmediate(callback, ...args) {
	var channel = new MessageChannel();
	channel.port1.onmessage = function() {
		callback(...args);
	};
	channel.port2.postMessage(null);
}

async function schedulerDotYield() {
	return new Promise(resolve => {
		setImmediate(resolve);
	});
}

async function rAF() {
	return new Promise(resolve => {
		requestAnimationFrame(resolve);
	});
}

async function rPAF() {
	await rAF();
	await schedulerDotYield();
}

// TODO: (Perhaps) ideally this would be scheduler API, based on dom imvalidation or something
let needsNextPaint_ = false;
function needsNextPaint() {
	return needsNextPaint_;
}

// TODO: Ideally we don't need to mark ourselves
async function markNeedsNextPaint() {
	needsNextPaint_ = true;
	await rPAF();
	needsNextPaint_ = false;
}

async function schedulerDotYieldIfNeeded() {
	// Technically pending input isn't proof that we require next paint..., just that we should yield.
	// But unless all event handlers call markNeedsNextPaint correctly, lets just mark it anyway.
	if (navigator.scheduling.isInputPending()) {
		markNeedsNextPaint();
	}
	if (needsNextPaint()) {
		await rPAF();
		// Mark after a frame (so deadline resets after)
		markDidYield();
	}
}

const DEADLINE = 100;
let last_yield_ = 0;
function needsYield() {
	return (performance.now() - last_yield_) > DEADLINE;
}
function markDidYield() {
	last_yield_ = performance.now();
}

async function schedulerDotYieldIfNeededWithDeadlines() {
	await schedulerDotYieldIfNeeded();
	if (needsYield()) {
		// Mark before yielding (so deadline resets before)
		markDidYield();
		await schedulerDotYield();
	}
}


export {
	markNeedsNextPaint,
	schedulerDotYield,
	schedulerDotYieldIfNeeded,
	schedulerDotYieldIfNeededWithDeadlines,
}