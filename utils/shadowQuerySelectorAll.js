// Inspiration: https://www.abeautifulsite.net/posts/querying-through-shadow-roots/

/*
 * Acts like querySelectorAll, except you can pass a list of selectors...
 * Each selector is evaluated within the shadowRoot of the previous NodeList
 * 
 * Optionally:  call with a single string separated by `>>>`
 */
export default function* shadowQuerySelectorAll(selectors, rootNode = document) {
	if (typeof selectors === 'string') {
		return yield* shadowQuerySelectorAll(String(selectors).split('>>>'), rootNode);
	}

	if (!rootNode || !selectors || selectors.length == 0)
		return;

	const selector = selectors.shift();
	const nodes = rootNode?.querySelectorAll(selector);

	if (!nodes || nodes.length == 0)
		return yield* shadowQuerySelectorAll([selector, ...selectors], rootNode?.shadowRoot);

	if (selectors.length == 0)
		return yield* nodes;

	for (let node of nodes) {
		yield* shadowQuerySelectorAll(selectors.slice(1), node?.shadowRoot);
	}
}