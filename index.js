import { logAllInteractions } from "./utils/onInteraction.js";
import { appendMessageToPage, blockFor } from "./helpers.js";

logAllInteractions();

function updateUI() {
  // console.log("Update the page");
  appendMessageToPage();
}

function getBusy() {
  // This could be "some script"
  blockFor(200);
}

const button = document.getElementById("myButton");

button.addEventListener("click", () => {
  getBusy();
  updateUI();
});
