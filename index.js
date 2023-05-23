import { blockFor } from "./workshop/utils/blockFor.js";
import { schedulerDotYield } from "./workshop/utils/schedulerDotYield.js";

const score = document.querySelector('score-keeper');
const button = score.button;

button.addEventListener("click", () => {
  // blockFor(1000);
  score.incrementAndUpdateUI();
});

