button.addEventListener("click", () => {
	score.incrementAndUpdateUI();
}, { capture: false });
  
button.addEventListener("click", () => {
	blockFor(1000);
}, { capture: true });