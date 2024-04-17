import { blockFor } from "./workshop/utils/blockFor.js";

const score = document.querySelector('score-keeper');
const button = score.button;

button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  // Test one at a time!

  setTimeout(() => {
    blockFor(1000);
  }, 0);

  Promise.resolve().then(() => {
    blockFor(1000);
  });

  requestAnimationFrame(() => {
    blockFor(1000);
  });

  requestIdleCallback(() => {
    blockFor(1000);
  });

  scheduler.postTask(() => {
    blockFor(1000);
  }, { priority: "background", delay: 0 }); // "user-visible", "background"
});