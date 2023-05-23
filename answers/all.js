button.addEventListener("click", () => {
	blockFor(1000);
	score.incrementAndUpdateUI();
  
	// setTimeout(() => {
	//   console.log("setTimeout fired");
	//   score.incrementAndUpdateUI();
	//   // blockFor(1000);
	// }, 1000);
  
	// setTimeout(() => {
	//   blockFor(1000);
	// }, 0);
  
	// Promise.resolve().then(() => {
	//   blockFor(1000);
	// });
  
	// requestAnimationFrame(() => {
	//   blockFor(1000);
	// });
  
	// requestIdleCallback(() => {
	//   blockFor(1000);
	// });
  
	// scheduler.postTask(() => {
	//   blockFor(1000);
	// }, { priority: "background", delay: 0 }); // "user-visible", "background"
  
	// Anything else?
	// Web Worker?
  });
  

  
  function blockInPieces(ms) {
	const parts = ms / 10;
	for (let i = 0; i < parts; i++) {
	  scheduler.postTask(() => {
		blockFor(10);
	  }, { priority: "background", delay: 0 });
	}
  }
  
  async function blockInPiecesYieldy(ms) {
	const parts = ms / 10;
	for (let i = 0; i < parts; i++) {
	  await scheduler.yield(); // TODO: polyfill
	  blockFor(10);
	}
  }
  
  async function blockInPiecesYieldyAborty(ms, signal) {
	const parts = ms / 10;
	for (let i = 0; i < parts; i++) {
	  if (signal.aborted) return;
	  await scheduler.yield(); // TODO: polyfill
	  blockFor(10);
	}
  }
  
  
  let timer = null;
  button.addEventListener("click", () => {
    score.incrementAndUpdateUI();
    abourtController.abort();
  
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      // blockFor(1000);
  
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
      // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
  
      // blockInPieces(1000);
      // await blockInPiecesYieldy(1000);
      await blockInPiecesYieldyAborty(1000, abourtController.signal);
    }, 1000);
  });
  
  let abortController = new AbortController();
  button.addEventListener("click", async () => {
	score.incrementAndUpdateUI();
	// await blockInPiecesYieldy(1000);
  
	abortController.abort();
	abortController = new AbortController();
	await blockInPiecesYieldyAborty(1000, abortController.signal);
  });