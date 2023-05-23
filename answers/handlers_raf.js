button.addEventListener("click", () => {
	score.incrementAndUpdateUI();
	requestAnimationFrame(() => {
		blockFor(1000);
	})
});