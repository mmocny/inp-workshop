import { blockFor } from "./workshop/utils/blockFor.js";

const score = document.querySelector('score-keeper');
const button = score.button;

// button.addEventListener("click", () => {
//   // blockFor(1000);
//   score.incrementAndUpdateUI();
// });

button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  requestAnimationFrame(() => {
      blockFor(1000);
  })
});