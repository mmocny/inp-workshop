export function blockFor(ms) {
  const target = performance.now() + ms;
  while (performance.now() < target);
}

export function addCSS(css) {
  const style = document.createElement("style");
  style.innerText = css;
  console.log(style);
  document.head.appendChild(style);
}