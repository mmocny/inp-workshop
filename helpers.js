export function appendMessageToPage() {
  const div = document.createElement("div");
  div.innerText = "Clicked!";

  const animation = div.animate(
    [{ opacity: 0 }, { opacity: 100 }, { opacity: 0 }],
    {
      duration: 500,
      iterations: 1
    }
  );
  animation.onfinish = (event) => {
    document.body.removeChild(div);
  };
  document.body.appendChild(div);
}

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