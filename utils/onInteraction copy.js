import PerformanceIterator from './PerformanceIterator.js';

const interactions = new Map();
const timeouts = new Set();

// We want to wait until all parts of the interaction are reported.
// This is difficult to do perfectly (would require a state machine).  Instead, lets just throttle the frequency.
// Occasionally, this may be wrong.
function bounce(callback, interactionId) {
	if (timeouts.has(interactionId)) return;
	timeouts.add(interactionId);
	requestIdleCallback(() => callback({ interactionId, value: interactions.get(interactionId) }));
	// TODO: remove timeouts after callback
}

export default async function onInteraction(callback) {
	for await (let entry of PerformanceIterator({ type: 'event', buffered: 'true', durationThreshold: 0 })) {
		if (!entry.interactionId) continue;
		if (!interactions.has(entry.interactionId)) {
			interactions.set(entry.interactionId, entry.duration);
		} else {
			interactions.set(entry.interactionId, Math.max(interactions.get(entry.interactionId), entry.duration));
		}
		
		bounce(callback, entry.interactionId);
	}
}