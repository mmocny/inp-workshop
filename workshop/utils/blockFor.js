export function blockFor(ms) {
  const target = performance.now() + ms;
  while (performance.now() < target);
}

export default blockFor;