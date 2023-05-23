import { logAllInteractions } from "./workshop/utils/onInteraction.js";
import { blockFor } from "./workshop/utils/blockFor.js";
import { schedulerDotYield } from "./workshop/utils/schedulerDotYield.js";

logAllInteractions();

const score = document.querySelector('score-keeper');
const button = score.button;


/**
  * Introduce demo page.
  * 
  * Basic Demos:
  * - A button that updates a count.
  * - Default actions (:active state) on a button.  Also: text input, checkbox, radio, select...
  * - In this case, our button uses JavaScript to update the count. Let's take a look...
  * 
  * Follow: Uncomment the line to block UI.
  */
button.addEventListener("click", () => {
  blockFor(1000);
  score.incrementAndUpdateUI();

  // 10x 100ms blocks = 1000ms
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);
  // blockFor(100);

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

// button.addEventListener("pointerup", () => {
//   blockFor(1000);
// });

setInterval(() => {
  // blockFor(1000);
}, 2000);


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


// let timer = null;
// button.addEventListener("click", () => {
//   score.incrementAndUpdateUI();
//   abourtController.abort();

//   if (timer) {
//     clearTimeout(timer);
//   }
//   timer = setTimeout(async () => {
//     // blockFor(1000);

//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });
//     // scheduler.postTask(() => blockFor(100), { priority: "background", delay: 0 });

//     // blockInPieces(1000);
//     // await blockInPiecesYieldy(1000);
//     await blockInPiecesYieldyAborty(1000, abourtController.signal);
//   }, 1000);
// });

let abortController = new AbortController();
button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();
  // await blockInPiecesYieldy(1000);

  abortController.abort();
  abortController = new AbortController();
  await blockInPiecesYieldyAborty(1000, abortController.signal);
});
