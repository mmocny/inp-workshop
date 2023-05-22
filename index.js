import { logAllInteractions } from "./utils/onInteraction.js";
import { blockFor } from "./helpers.js";

logAllInteractions();

const score = document.querySelector('score-keeper');
const button = score.button;


/**
  * Introduce demo page.
  * 
  * Basic Demos:
  * - A button that updates a count.
  * - Default actions (:active state) on a button.  Also: text input, checkbox, radio, select...
  * - In this case, our button uses JavaScript to update the count.
  * 
  * Follow: Uncomment the line to block UI.
  */
button.addEventListener("click", () => {
  blockFor(1000);
  score.incrementAndUpdateUI();
});

/**
 * - Showcase Tooling
 */
