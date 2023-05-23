button.addEventListener("click", () => {
	score.incrementAndUpdateUI();
});
  
setInterval(() => {
	blockFor(1000);
}, 2000);