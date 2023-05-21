/*
 * Usage:
 * 
 * for await (let entry of PerformanceIterator({ ...<PerformanceObserverOptions> })) {
 *   // Use `entry`
 * }
 * 
 * A note of caution, this for loop never resolves to completion since the Iterator is infinite
 * (and so it blocks execution forever).
 * 
 * Suggest calling the for-await loop from its own async function and then not awaiting the results
 */
export default async function* PerformanceIterator(args) {
	let resolve;
  
	new PerformanceObserver(l => {
		resolve(l.getEntries());
	}).observe(args);
  
  
	for (;;) {
		const entries = await new Promise(resolve_ => {
			resolve = resolve_;
		});
		for (let entry of entries) {
			yield entry;
		}
	}
} 